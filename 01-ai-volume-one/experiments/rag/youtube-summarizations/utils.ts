// Import Ollama API settings from config
import { baseUrl, config, modelName } from "./config.ts";
export { baseUrl, modelName };

// Check for required tools
export async function checkRequiredTools(): Promise<boolean> {
  let hasYtDlp = false;

  try {
    const ytdlpProcess = new Deno.Command("yt-dlp", {
      args: ["--version"],
      stdout: "piped",
      stderr: "piped",
    });
    const ytdlpOutput = await ytdlpProcess.output();
    hasYtDlp = ytdlpOutput.code === 0;
  } catch (_e) {
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

// Parse command line arguments
export function parseCommandLineArgs(args: string[]): {
  url: string;
  startChunk?: number;
  endChunk?: number;
  specificChunks?: number[];
} {
  if (args.length < 1) {
    console.error("Please provide a YouTube URL as an argument");
    Deno.exit(1);
  }

  const result: any = {
    url: args[0]
  };

  // Process additional arguments
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === "--start-chunk" || arg === "-s") {
      result.startChunk = parseInt(args[++i]);
    } else if (arg === "--end-chunk" || arg === "-e") {
      result.endChunk = parseInt(args[++i]);
    } else if (arg === "--chunks" || arg === "-c") {
      result.specificChunks = args[++i].split(',').map(Number);
    }
  }

  return result;
}

// Function to sanitize filenames
export function sanitizeFilename(name: string): string {
  let sanitized = name.replace(/\s+/g, "-");
  sanitized = sanitized.replace(/[\/\\:*?"<>|]/g, "");
  if (sanitized.length > config.maxFilenameLength) {
    sanitized = sanitized.substring(0, config.maxFilenameLength);
  }
  return sanitized;
}

// Display a spinner animation during processing
export function startSpinner(): number {
  const spinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  return setInterval(() => {
    Deno.stdout.writeSync(
      new TextEncoder().encode(`\r${spinners[i]} Processing...`),
    );
    i = (i + 1) % spinners.length;
  }, 100);
}

// Split transcript into chunks to avoid context length issues
export function splitTranscript(
  transcript: string,
  maxChunkSize: number = config.maxChunkSize,
): string[] {
  const words = transcript.split(" ");
  const chunks: string[] = [];
  let currentChunk = "";

  for (const word of words) {
    if ((currentChunk + " " + word).length > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = word;
    } else {
      currentChunk = currentChunk ? currentChunk + " " + word : word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Load prompt templates from files
export async function loadPrompt(promptName: string): Promise<string> {
  try {
    return await Deno.readTextFile(`${config.promptsDir}/${promptName}.md`);
  } catch (error) {
    console.error(`Error loading prompt ${promptName}:`, error);
    throw error;
  }
}

// Extract video ID from YouTube URL
export function extractVideoId(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : "";
}
