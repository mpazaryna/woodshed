// youtube-summarizer.ts - Simple rule-based approach
// Usage: deno run --allow-net --allow-run --allow-read --allow-env youtube-summarizer.ts https://www.youtube.com/watch?v=VIDEOID

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

// Check for required tools
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

// Extract the host and guest names
async function extractNamesRule(transcript: string): Promise<{host: string, guest: string}> {
  // Simple rule-based extraction
  try {
    const welcomeMatch = transcript.match(/Welcome to ([^,\.]+)/i);
    const imMatch = transcript.match(/[Ii]'m ([^,\.]+)/i);
    const todayMatch = transcript.match(/today my guest is ([^,\.]+)/i);
    
    let host = "the host";
    let guest = "the guest";
    
    if (welcomeMatch && welcomeMatch[1]) {
      // Extract show name
    }
    
    if (imMatch && imMatch[1]) {
      host = imMatch[1].trim();
    }
    
    if (todayMatch && todayMatch[1]) {
      guest = todayMatch[1].trim();
    }
    
    return { host, guest };
  } catch (error) {
    console.error("Error extracting names rule-based:", error);
    return { host: "the host", guest: "the guest" };
  }
}

// Extract key sentences
function extractKeyContent(transcript: string): string[] {
  const sentences = transcript.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
  
  // Define patterns for important content
  const importantPatterns = [
    /gallery/i, 
    /art/i, 
    /started/i, 
    /artist/i, 
    /represent/i,
    /work/i,
    /show/i,
    /exhibition/i,
    /program/i,
    /background/i,
    /york/i,
    /jersey/i,
    /collector/i,
    /space/i,
    /home/i,
    /house/i,
    /live/i
  ];
  
  // Filter sentences that contain important patterns
  const keyContent = sentences.filter(sentence => {
    // Skip very short sentences
    if (sentence.split(' ').length < 5) return false;
    
    // Keep sentences matching our patterns
    return importantPatterns.some(pattern => pattern.test(sentence));
  });
  
  // Limit to a reasonable number of sentences
  return keyContent.slice(0, 30);
}

// Extract direct quotes
function extractDirectQuotes(transcript: string): string[] {
  const quotes: string[] = [];
  
  // Look for phrases in quotes
  const quoteMatches = transcript.match(/"([^"]+)"/g);
  if (quoteMatches) {
    quoteMatches.forEach(quote => {
      if (quote.split(' ').length > 5 && quote.split(' ').length < 20) {
        quotes.push(quote);
      }
    });
  }
  
  // Look for statements that sound like quotes
  const statementPatterns = [
    "our feeling is", 
    "we started", 
    "I was", 
    "we like", 
    "we do",
    "we got"
  ];
  
  statementPatterns.forEach(pattern => {
    const regex = new RegExp(`(${pattern}[^.!?]+[.!?])`, 'gi');
    const matches = transcript.match(regex);
    if (matches) {
      matches.forEach(match => {
        if (match.split(' ').length > 5 && match.split(' ').length < 25) {
          quotes.push(`"${match.trim()}"`);
        }
      });
    }
  });
  
  // Return at most 3 quotes
  return quotes.slice(0, 3);
}

// Direct GPT-4 API call for backup
async function useBackupGPT4(transcript: string, videoTitle: string): Promise<string> {
  try {
    console.log("Trying to use backup GPT-4 API...");
    
    // Check if OpenAI API key is available
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.log("OpenAI API key not found in environment variables");
      return "";
    }
    
    const prompt = `
Please create a concise but detailed summary of the following YouTube video transcript titled "${videoTitle}".

Focus on extracting:
1. The names of people involved (host, guest, mentioned people)
2. Key topics discussed
3. Main points and insights
4. Background information about the people
5. Projects or initiatives mentioned

DO NOT include information not found in the transcript. Be specific and factual.

TRANSCRIPT:
${transcript.substring(0, 15000)}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            "role": "system",
            "content": "You are a professional, accurate content summarizer that focuses on factual information."
          },
          {
            "role": "user",
            "content": prompt
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error using backup GPT-4:", error);
    return "";
  }
}

// Ultra-Simple summarization with Ollama
async function simpleSummarize(transcript: string, videoTitle: string, hostGuest: {host: string, guest: string}): Promise<string> {
  try {
    console.log("Generating simple summary...");
    
    // Extract key content rule-based
    const keyContentList = extractKeyContent(transcript);
    const keyContent = keyContentList.join(" ");
    
    // Extract quotes rule-based
    const quotes = extractDirectQuotes(transcript);
    
    // Ultra simple prompt that focuses just on facts
    const prompt = `
Your task is to write a factual summary of this YouTube video transcript titled "${videoTitle}".

HOST NAME: ${hostGuest.host}
GUEST NAME: ${hostGuest.guest}

Here are the most important sentences from the transcript:
${keyContent}

Here are some notable quotes from the transcript:
${quotes.join('\n')}

Create a summary that:
1. ONLY uses information from the provided sentences
2. Mentions the host and guest by name
3. Describes what the conversation is about
4. Includes at least one direct quote
5. Is organized into 3-4 paragraphs

DO NOT add any information not found in the provided sentences.
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
    return data.response.trim();
  } catch (error) {
    console.error("Error generating simple summary:", error);
    throw error;
  }
}

// Main function with very simple approach
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
    
    // Extract host and guest names with simple rules
    const hostGuest = await extractNamesRule(transcript);
    console.log(`Detected: Host "${hostGuest.host}", Guest "${hostGuest.guest}"`);
    
    // Generate summary with simple approach
    let summary = await simpleSummarize(transcript, videoTitle, hostGuest);
    
    // Try GPT-4 as backup if available and Ollama result is poor
    if (summary.length < 200 || summary.includes("[Host Name]") || summary.includes("[Guest Name]")) {
      console.log("Simple summary appears to be low quality, trying backup...");
      const backupSummary = await useBackupGPT4(transcript, videoTitle);
      if (backupSummary && backupSummary.length > summary.length) {
        summary = backupSummary;
      }
    }
    
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