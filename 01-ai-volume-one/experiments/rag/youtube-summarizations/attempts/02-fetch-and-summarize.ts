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

// Fetch the transcript using youtube-dl
async function fetchTranscriptWithYoutubeDl(videoId: string): Promise<string> {
  try {
    console.log("Fetching transcript with youtube-dl...");
    
    // Create a temporary file to store the transcript
    const tempFile = await Deno.makeTempFile({ suffix: '.vtt' });
    
    // Use youtube-dl to download only the subtitles/transcript
    const process = Deno.run({
      cmd: [
        "youtube-dl",
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
      throw new Error(`youtube-dl failed: ${errorOutput}`);
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
    console.error("Error fetching transcript with youtube-dl:", error);
    
    // Fallback to yt-dlp if youtube-dl fails
    return fetchTranscriptWithYtDlp(videoId);
  }
}

// Fallback: Fetch the transcript using yt-dlp (more up-to-date than youtube-dl)
async function fetchTranscriptWithYtDlp(videoId: string): Promise<string> {
  try {
    console.log("Fetching transcript with yt-dlp (fallback method)...");
    
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
    console.log("Trying direct web method as last resort...");
    return fetchTranscriptDirectly(videoId);
  }
}

// Add a direct web API method to fetch transcripts
async function fetchTranscriptDirectly(videoId: string): Promise<string> {
  try {
    console.log("Fetching transcript directly via web API...");
    
    // First, try to get available transcript tracks
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch video page: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract transcript using regex from page HTML
    // This is a simplified approach and might break with YouTube changes
    console.log("Extracting transcript from page...");
    
    // Try to find any text content from the page that might be useful
    let transcript = "";
    
    // Look for description content as fallback
    const descMatch = html.match(/"description":\s*"([^"]+)"/);
    if (descMatch && descMatch[1]) {
      transcript += descMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"') + " ";
    }
    
    // Look for title and keywords for context
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch && titleMatch[1]) {
      transcript += titleMatch[1] + " ";
    }
    
    // If we couldn't get much content, inform the user
    if (transcript.length < 200) {
      transcript += " [Note: Only limited content could be extracted directly. For better results, please install youtube-dl or yt-dlp.]";
    }
    
    return transcript;
  } catch (error) {
    console.error("Error fetching transcript directly:", error);
    return "Failed to extract transcript. Please install youtube-dl or yt-dlp for better results.";
  }
}

// Summarize text using Ollama
async function summarizeWithOllama(text: string): Promise<string> {
  try {
    console.log("Sending transcript to Ollama for summarization...");
    
    const prompt = `
You are a professional content summarizer. Please summarize the following YouTube video transcript.
Focus on the main points, key takeaways, and overall structure of the content.
Format your response with sections for:
1. Summary (2-3 sentences)
2. Key Points (bullet points)
3. Detailed Overview (several paragraphs)

Here is the transcript:
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

// Display a spinner animation during processing
function startSpinner(): number {
  const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  return setInterval(() => {
    Deno.stdout.writeSync(new TextEncoder().encode(`\r${spinners[i]} Processing...`));
    i = (i + 1) % spinners.length;
  }, 100);
}

// Add a function to fetch video title
async function fetchVideoTitle(videoId: string): Promise<string> {
  try {
    console.log("Fetching video title...");
    
    // Try yt-dlp first (more reliable)
    try {
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
    } catch (error) {
      // Fallback to youtube-dl if yt-dlp fails
    }
    
    // Try youtube-dl as fallback
    const process = Deno.run({
      cmd: [
        "youtube-dl",
        "--skip-download",
        "--get-title",
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
    return "Unknown Title"; // Default if both methods fail
  } catch (error) {
    console.error("Error fetching video title:", error);
    return "Unknown Title";
  }
}

// Add a check for required tools at the beginning of main
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

// Add a function to sanitize filenames
function sanitizeFilename(name: string): string {
  // Replace spaces with hyphens
  let sanitized = name.replace(/\s+/g, '-');
  
  // Remove invalid filename characters
  sanitized = sanitized.replace(/[\/\\:*?"<>|]/g, '');
  
  // Limit length to avoid too long filenames
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }
  
  return sanitized;
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
    
    // Skip youtube-dl and use yt-dlp directly
    const transcript = await fetchTranscriptWithYtDlp(videoId);
    console.log(`\nTranscript fetched: ${transcript.length} characters`);
    
    // If transcript is too short, it might indicate an error
    if (transcript.length < 100) {
      throw new Error("Transcript seems too short, possible error in extraction");
    }
    
    // Summarize the transcript
    const summary = await summarizeWithOllama(transcript);
    
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
