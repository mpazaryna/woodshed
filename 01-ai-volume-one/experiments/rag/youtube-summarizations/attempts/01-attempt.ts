// youtube-summarizer.ts - Staged approach for accurate summaries
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

// Split transcript into chunks to avoid context length issues
function splitTranscript(transcript: string, maxChunkSize: number = 6000): string[] {
  const words = transcript.split(' ');
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const word of words) {
    if ((currentChunk + ' ' + word).length > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = word;
    } else {
      currentChunk = currentChunk ? currentChunk + ' ' + word : word;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// STAGE 1: Extract key entities from the transcript
async function extractEntities(text: string): Promise<any> {
  try {
    console.log("Extracting key entities from transcript...");
    
    const prompt = `
You are an expert entity extractor. Review this transcript and identify ONLY the key entities mentioned.
Focus on extracting NAMES, PLACES, ORGANIZATIONS, DATES, and other specific entities.
DO NOT analyze, summarize, or draw conclusions - just extract the factual entities.

Format your response as JSON with these categories:
- host_name: The name of the podcast/show host
- guest_name: The name of the interviewee
- show_name: The name of the podcast/show if mentioned
- locations: Array of locations mentioned
- organizations: Array of organizations, galleries, institutions mentioned
- dates: Array of specific dates or time periods mentioned
- key_people: Array of other people mentioned
- key_projects: Array of projects, exhibitions, or initiatives discussed

TRANSCRIPT:
${text}

JSON RESPONSE:
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
    try {
      // Find the JSON in the response
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch (error) {
      console.error("Error parsing JSON from entity extraction:", error);
      return {};
    }
  } catch (error) {
    console.error("Error extracting entities:", error);
    return {};
  }
}

// STAGE 2: Extract key topics from the transcript
async function extractTopics(text: string): Promise<string[]> {
  try {
    console.log("Extracting key topics from transcript...");
    
    const prompt = `
You are an expert topic analyzer. Review this transcript and identify the 5-7 main topics discussed.
Be specific and base your topics ONLY on what's explicitly mentioned in the transcript.
DO NOT invent topics not covered in the conversation.

Format your response as a simple JSON array of strings, each representing a main topic.

TRANSCRIPT:
${text}

JSON RESPONSE:
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
    try {
      // Find the JSON array in the response
      const jsonMatch = data.response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error("Error parsing JSON from topic extraction:", error);
      return [];
    }
  } catch (error) {
    console.error("Error extracting topics:", error);
    return [];
  }
}

// STAGE 3: Extract notable quotes from the transcript
async function extractQuotes(text: string): Promise<string[]> {
  try {
    console.log("Extracting notable quotes from transcript...");
    
    const prompt = `
You are an expert quote extractor. Review this transcript and identify 2-3 significant quotes that capture important moments or insights.
Choose quotes that are meaningful and representative of key points in the conversation.
Extract the quotes VERBATIM from the transcript - do not modify them.

Format your response as a simple JSON array of strings, each representing a direct quote.

TRANSCRIPT:
${text}

JSON RESPONSE:
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
    try {
      // Find the JSON array in the response
      const jsonMatch = data.response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error("Error parsing JSON from quote extraction:", error);
      return [];
    }
  } catch (error) {
    console.error("Error extracting quotes:", error);
    return [];
  }
}

// FINAL STAGE: Generate summary using extracted information
async function generateSummary(transcript: string, entities: any, topics: string[], quotes: string[], videoTitle: string): Promise<string> {
  try {
    console.log("Generating final summary...");
    
    // Create a simplified representation of the analysis to include in the prompt
    const analysisData = {
      host: entities.host_name || "The host",
      guest: entities.guest_name || "The guest",
      show_name: entities.show_name || "this show",
      locations: entities.locations || [],
      organizations: entities.organizations || [],
      key_people: entities.key_people || [],
      topics: topics,
      quotes: quotes
    };
    
    const prompt = `
You are a professional podcast summarizer. Create a detailed, factual summary of this transcript based on the following verified information:

VERIFIED INFORMATION:
${JSON.stringify(analysisData, null, 2)}

The summary should be structured in clear paragraphs that follow the flow of the conversation. Include ALL the verified names, organizations, and places from the analysis above. Include at least one direct quote (in quotation marks).

DO NOT invent details or add information not present in the provided analysis or transcript.

TRANSCRIPT:
${transcript.substring(0, 2000)}... [transcript continues]

Your summary should be comprehensive but factual - focus on what was actually discussed.
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
    console.error("Error generating summary:", error);
    throw error;
  }
}

// Main function with staged approach
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
    
    // Process in stages to get better accuracy
    const entities = await extractEntities(transcript.substring(0, 8000)); // First part of transcript for entities
    const topics = await extractTopics(transcript);
    const quotes = await extractQuotes(transcript);
    
    // Generate the final summary using the extracted information
    const summary = await generateSummary(transcript, entities, topics, quotes, videoTitle);
    
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