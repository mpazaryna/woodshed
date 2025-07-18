// Deno API is available by default in Deno runtime
// No need to import it explicitly

// Define Ollama API settings
const baseUrl = "http://localhost:11434";
const modelName = "llama3.2";

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
    let transcriptContent: string;
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
      .filter((line: string) =>
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

    const promptTemplate = await loadPrompt("entity-extraction");
    const prompt = promptTemplate.replace("{transcript}", text);

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

    const promptTemplate = await loadPrompt("topic-extraction");
    const prompt = promptTemplate.replace("{transcript}", text);

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

    const promptTemplate = await loadPrompt("quote-extraction");
    const prompt = promptTemplate.replace("{transcript}", text);

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
async function generateSummary(transcript: string, entities: any, topics: string[], quotes: string[]): Promise<string> {
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

    const promptTemplate = await loadPrompt("final-summary");
    const prompt = promptTemplate
      .replace("{analysis_data}", JSON.stringify(analysisData, null, 2))
      .replace("{transcript_preview}", transcript.substring(0, 2000));

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
    console.error("Error generating summary:", error);
    return "Failed to generate summary.";
  }
}

// Load prompt templates from files
async function loadPrompt(promptName: string): Promise<string> {
  try {
    return await Deno.readTextFile(`./prompts/${promptName}.md`);
  } catch (error) {
    console.error(`Error loading prompt ${promptName}:`, error);
    throw error;
  }
}

// Extract video ID from YouTube URL
function extractVideoId(url: string): string {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : "";
}

// Main function
async function main() {
  // Check for command line arguments
  if (Deno.args.length < 1) {
    console.error("Please provide a YouTube URL as an argument");
    Deno.exit(1);
  }

  const youtubeUrl = Deno.args[0];
  const videoId = extractVideoId(youtubeUrl);

  if (!videoId) {
    console.error("Invalid YouTube URL");
    Deno.exit(1);
  }

  // Check for required tools
  await checkRequiredTools();

  // Fetch video title
  const videoTitle = await fetchVideoTitle(videoId);
  console.log(`Processing video: ${videoTitle}`);

  // Fetch transcript
  const transcript = await fetchTranscriptWithYtDlp(videoId);

  if (!transcript || transcript.includes("Failed to extract transcript")) {
    console.error("Could not extract transcript. Please check the URL and try again.");
    Deno.exit(1);
  }

  console.log(`Transcript length: ${transcript.length} characters`);

  // Start spinner for processing indication
  const spinner = startSpinner();

  // Split transcript into manageable chunks
  const chunks = splitTranscript(transcript);
  console.log(`Split transcript into ${chunks.length} chunks for processing`);

  // Process first chunk for entity extraction
  const entities = await extractEntities(chunks[0]);

  // Process all chunks for topics and quotes
  let allTopics: string[] = [];
  let allQuotes: string[] = [];

  for (const chunk of chunks) {
    const chunkTopics = await extractTopics(chunk);
    const chunkQuotes = await extractQuotes(chunk);

    allTopics = [...allTopics, ...chunkTopics];
    allQuotes = [...allQuotes, ...chunkQuotes];
  }

  // Remove duplicates
  allTopics = [...new Set(allTopics)];
  allQuotes = [...new Set(allQuotes)];

  // Stop spinner
  clearInterval(spinner);
  Deno.stdout.writeSync(new TextEncoder().encode("\r                      \r"));

  // Generate final summary
  const summary = await generateSummary(transcript, entities, allTopics, allQuotes);

  // Create output file
  const sanitizedTitle = sanitizeFilename(videoTitle);
  const outputFile = `${sanitizedTitle}-summary.md`;

  // Write summary to file
  await Deno.writeTextFile(outputFile, summary);

  console.log(`\n✅ Summary saved to ${outputFile}`);
}

// Run the main function
main();