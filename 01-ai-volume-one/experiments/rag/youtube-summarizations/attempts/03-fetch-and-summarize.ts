// youtube-summarizer.ts - Summarize YouTube videos using Ollama
// Usage: deno run --allow-net --allow-run --allow-read youtube-summarizer.ts https://www.youtube.com/watch?v=VIDEOID

// Configuration
const modelName: string = "llama3.2";
const baseUrl: string = "http://localhost:11434";

// Get the YouTube URL from command line arguments
const youtubeUrl = Deno.args[0];
if (!youtubeUrl) {
  console.error("Please provide a YouTube URL as an argument");
  Deno.exit(1);
}

// Extract video ID from various forms of YouTube URLs
function extractVideoId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : "";
}

const videoId = extractVideoId(youtubeUrl);
if (!videoId) {
  console.error("Invalid YouTube URL");
  Deno.exit(1);
}

// Check for required tools at the beginning of main
async function checkRequiredTools(): Promise<boolean> {
  let hasYtDlp = false;
  
  try {
    const ytdlpProcess = Deno.run({
      cmd: ["yt-dlp", "--version"],
      stdout: "piped",
      stderr: "piped"
    });
    const ytdlpStatus = await ytdlpProcess.status();
    ytdlpProcess.close();
    hasYtDlp = ytdlpStatus.success;
  } catch (e) {
    // yt-dlp not found
  }
  
  if (!hasYtDlp) {
    console.warn("\n⚠️  Warning: yt-dlp is not installed.");
    console.warn("For best results, install yt-dlp:");
    console.warn("  - yt-dlp: https://github.com/yt-dlp/yt-dlp");
    console.warn("Continuing with limited functionality...\n");
    return false;
  }
  
  return true;
}

// Fetch the transcript using yt-dlp
async function fetchTranscriptWithYtDlp(videoId: string): Promise<string> {
  try {
    console.log("Fetching transcript with yt-dlp...");
    
    // Create a temporary file to store the transcript
    const tempFile = await Deno.makeTempFile({ suffix: '.vtt' });
    
    // Use yt-dlp to download only the subtitles/transcript
    const process = Deno.run({
      cmd: [
        "yt-dlp",
        "--skip-download",
        "--write-auto-sub",
        "--sub-format", "vtt",
        "--sub-lang", "en",
        "-o", tempFile.replace(/\.vtt$/, ""),
        `https://www.youtube.com/watch?v=${videoId}`
      ],
      stdout: "piped",
      stderr: "piped"
    });
    
    const status = await process.status();
    process.close();
    
    if (!status.success) {
      const errorOutput = new TextDecoder().decode(await process.stderrOutput());
      throw new Error(`yt-dlp failed: ${errorOutput}`);
    }
    
    // Read the downloaded transcript file
    let transcriptContent;
    try {
      transcriptContent = await Deno.readTextFile(`${tempFile.replace(/\.vtt$/, "")}.en.vtt`);
    } catch (error) {
      try {
        // Try alternative filename pattern
        transcriptContent = await Deno.readTextFile(`${tempFile.replace(/\.vtt$/, "")}.vtt`);
      } catch (error) {
        throw new Error("Could not find downloaded transcript file");
      }
    }
    
    // Clean up the VTT format to get plain text
    // Remove timing information and other VTT formatting
    const cleanedTranscript = transcriptContent
      .split('\n')
      .filter(line => 
        !line.match(/^\d{2}:\d{2}:\d{2}\.\d{3}/) && // Remove timestamp lines
        !line.match(/^WEBVTT/) && // Remove WEBVTT header
        !line.match(/^\s*$/) && // Remove empty lines
        !line.match(/^NOTE/) // Remove NOTE lines
      )
      .join(' ')
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' '); // Normalize whitespace
    
    // Clean up temp files
    try {
      await Deno.remove(`${tempFile.replace(/\.vtt$/, "")}.en.vtt`);
    } catch (error) {
      try {
        await Deno.remove(`${tempFile.replace(/\.vtt$/, "")}.vtt`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    
    return cleanedTranscript;
  } catch (error) {
    console.error("Error fetching transcript with yt-dlp:", error);
    return "Failed to extract transcript. Please install yt-dlp for best results.";
  }
}

// Function to fetch video title
async function fetchVideoTitle(videoId: string): Promise<string> {
  try {
    console.log("Fetching video title...");
    
    // Try yt-dlp
    const process = Deno.run({
      cmd: [
        "yt-dlp",
        "--skip-download",
        "--print", "title",
        `https://www.youtube.com/watch?v=${videoId}`
      ],
      stdout: "piped",
      stderr: "piped"
    });
    
    const status = await process.status();
    if (status.success) {
      const output = new TextDecoder().decode(await process.output());
      process.close();
      return output.trim();
    }
    
    process.close();
    return "Unknown Title"; // Default if method fails
  } catch (error) {
    console.error("Error fetching video title:", error);
    return "Unknown Title";
  }
}

// Function to sanitize filenames
function sanitizeFilename(name: string): string {
  let sanitized = name.replace(/\s+/g, '-');
  sanitized = sanitized.replace(/[\/\\:*?"<>|]/g, '');
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }
  return sanitized;
}

// Display a spinner animation during processing
function startSpinner(): number {
  const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  return setInterval(() => {
    Deno.stdout.writeSync(new TextEncoder().encode(`\r${spinners[i]} Processing...`));
    i = (i + 1) % spinners.length;
  }, 100);
}

// Summarize text using Ollama - DRAMATICALLY IMPROVED PROMPT
async function summarizeWithOllama(text: string, videoTitle: string): Promise<string> {
  try {
    console.log("Sending transcript to Ollama for summarization...");
    
    // Provide an example of a good summary to guide the model
    const exampleSummary = `
# YouTube Video Summary: The Radical Intimacy of the House Gallery: Rethinking the Contemporary Gallery w Liz Hirs

## Introduction to 839 Gallery
In this episode of "What's My Thesis," host Javier Bruinsa interviews Liz Hirs, co-founder of 839 Gallery, a residential gallery in Los Angeles that opened in June 2024. Liz explains their concept: "We started reaching out to artists that we kind of know real well and then also artists who we don't know super well but love the work." The gallery operates out of Liz and her husband Joshua Smith's home, which was built in 1924, creating an intimate viewing experience where collectors can see how art exists in a lived-in space rather than "in a PDF."

## Liz's Background and Transition from Artist to Gallerist
Liz grew up primarily in New Jersey (Fort Lee area), though she was born in Sarasota, Florida. She studied at Sarah Lawrence College with a focus on social sciences and art history, not exclusively art. After college, she attended a post-baccalaureate program at MICA in Baltimore for six months, where she was even an extra in Season 5 of "The Wire." She ultimately decided against pursuing an art career when offered a museum job in New York, explaining the transition was "a little painful too in a way to sort of be honest with yourself about what you can do."

## New York to Los Angeles Transition
Liz lived in New York from 2007-2017, working at Artist Space, an exhibition organization. There she met her husband Joshua Smith, a photographer-turned-painter who had previously run a gallery called John Connelly Presents. Together, they developed exhibition projects including "Apartment Show," displaying art in vacant apartments. In 2017, they moved to Los Angeles with their young son, partly motivated by Liz's research interest in LA artists from the 1970s-80s and alternative spaces. They now have two children (ages 6 and 9) who have grown up around art.

## 839 Gallery Operations and Philosophy
The gallery operates from their home, with Saturday open hours and appointments available during the week. Liz describes how they've adapted their living situation, explaining, "We got rid of our bed" in the master bedroom (now the main gallery space), replacing it with "a Japanese mattress that you roll out and you roll away." The family rooms remain intact, and they employ a "Friday cleanup rush" each week to prepare the space for visitors.
`;
    
    const prompt = `
You are a professional content summarizer specializing in transcript analysis. I need you to create a comprehensive and FACTUALLY ACCURATE summary of the following YouTube transcript from "${videoTitle}". 

IMPORTANT INSTRUCTIONS:
1. EXTRACT REAL NAMES - Identify and use the actual names of all people mentioned (host, guest, etc.). DO NOT use placeholders like [Host Name] or [Guest Name].

2. ONLY include information DIRECTLY from the transcript - Do not invent details, facts, or connections not explicitly stated.

3. VERIFY ALL KEY FACTS - Double-check names, dates, places, and organizations before including them.

4. ORGANIZE BY TOPICS - Structure your summary around the main topics discussed, following the chronology of the conversation.

5. INCLUDE DIRECT QUOTES - Use 2-3 verbatim quotes that capture important insights (in quotation marks with attribution).

6. CAPTURE SPECIFIC DETAILS - Include specific experiences, projects, dates, and personal history mentioned.

7. AVOID GENERIC CONTENT - Do not include generic statements that could apply to any interview. Every sentence should contain specific information from this video.

8. FORMAT PROPERLY - Use clear section headings and well-structured paragraphs.

HERE'S AN EXAMPLE of the detailed, fact-specific summary I'm looking for:
${exampleSummary}

Now, please analyze this transcript and create a similarly detailed and accurate summary:

TRANSCRIPT:
${text}
`;

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error summarizing with Ollama:", error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log(`Processing YouTube video: ${youtubeUrl}`);
    
    // Check for required tools
    await checkRequiredTools();
    
    const spinner = startSpinner();
    
    // Fetch the video title
    const videoTitle = await fetchVideoTitle(videoId);
    
    // Get transcript using yt-dlp
    const transcript = await fetchTranscriptWithYtDlp(videoId);
    console.log(`\nTranscript fetched: ${transcript.length} characters`);
    
    // If transcript is too short, it might indicate an error
    if (transcript.length < 100) {
      throw new Error("Transcript seems too short, possible error in extraction");
    }
    
    // Summarize the transcript with improved prompt and example
    const summary = await summarizeWithOllama(transcript, videoTitle);
    
    clearInterval(spinner);
    Deno.stdout.writeSync(new TextEncoder().encode("\r                     \r"));
    
    // Create markdown content with title and URL included
    const markdownContent = `# YouTube Video Summary: ${videoTitle}

## Video URL
[${youtubeUrl}](${youtubeUrl})

## Summary
${summary}

---
*Generated on ${new Date().toISOString().split('T')[0]}*
`;
    
    // Create filename based on video title and ID
    const sanitizedTitle = sanitizeFilename(videoTitle);
    const filename = `${sanitizedTitle}-${videoId}.md`;
    
    // Save to file
    await Deno.writeTextFile(filename, markdownContent);
    
    console.log(`\n===== SUMMARY FOR: ${videoTitle} =====\n`);
    console.log(summary);
    console.log(`\n===================\n`);
    console.log(`Summary saved to: ${filename}`);
    
  } catch (error) {
    console.error("\nError:", error.message);
    Deno.exit(1);
  }
}

// Execute the main function
main();