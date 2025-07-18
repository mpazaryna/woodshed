// transcript-segmenter.ts
// This file contains functions for segmenting transcripts with timestamps

import { baseUrl, loadPrompt, modelName } from "./utils.ts";

// Interface for a transcript segment with timestamp
export interface TranscriptSegment {
  timestamp: string; // Format: "MM:SS"
  text: string;
  title?: string;
}

// Function to extract transcript with timestamps from VTT file
export async function extractTranscriptWithTimestamps(
  videoId: string,
): Promise<TranscriptSegment[]> {
  try {
    console.log("Fetching transcript with timestamps...");

    // Create a temporary file to store the transcript
    const tempFile = await Deno.makeTempFile({ suffix: ".vtt" });

    // Use yt-dlp to download only the subtitles/transcript
    const process = new Deno.Command("yt-dlp", {
      args: [
        "--skip-download",
        "--write-auto-sub",
        "--sub-format",
        "vtt",
        "--sub-lang",
        "en",
        "-o",
        tempFile.replace(/\.vtt$/, ""),
        `https://www.youtube.com/watch?v=${videoId}`,
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const output = await process.output();

    if (output.code !== 0) {
      const errorOutput = new TextDecoder().decode(output.stderr);
      throw new Error(`yt-dlp failed: ${errorOutput}`);
    }

    // Read the downloaded transcript file
    let transcriptContent: string;
    try {
      transcriptContent = await Deno.readTextFile(
        `${tempFile.replace(/\.vtt$/, "")}.en.vtt`,
      );
    } catch (_error) {
      try {
        // Try alternative filename pattern
        transcriptContent = await Deno.readTextFile(
          `${tempFile.replace(/\.vtt$/, "")}.vtt`,
        );
      } catch (_error) {
        throw new Error("Could not find downloaded transcript file");
      }
    }

    // Parse the VTT file to extract timestamps and text
    const segments = parseVTTFile(transcriptContent);

    // Clean up temp files
    try {
      await Deno.remove(`${tempFile.replace(/\.vtt$/, "")}.en.vtt`);
    } catch (_error) {
      try {
        await Deno.remove(`${tempFile.replace(/\.vtt$/, "")}.vtt`);
      } catch (_error) {
        // Ignore cleanup errors
      }
    }

    return segments;
  } catch (error) {
    console.error("Error extracting transcript with timestamps:", error);
    return [];
  }
}

// Function to parse VTT file and extract timestamps and text
function parseVTTFile(vttContent: string): TranscriptSegment[] {
  const lines = vttContent.split("\n");
  const segments: TranscriptSegment[] = [];

  let currentTimestamp = "00:00";
  let currentText = "";
  let inCue = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and WEBVTT header
    if (line === "" || line === "WEBVTT" || line.startsWith("NOTE")) {
      continue;
    }

    // Check if this is a timestamp line
    const timestampMatch = line.match(/(\d{2}:\d{2}:\d{2})\.(\d{3})\s*-->/);
    if (timestampMatch) {
      // If we were in a cue, save the previous segment
      if (inCue && currentText) {
        segments.push({
          timestamp: currentTimestamp,
          text: currentText.trim(),
        });
      }

      // Extract the timestamp (HH:MM:SS format)
      const fullTimestamp = timestampMatch[1];
      // Convert to MM:SS format for display
      currentTimestamp = fullTimestamp.substring(3); // Skip the hours part

      currentText = "";
      inCue = true;
      continue;
    }

    // If we're in a cue, add this line to the current text
    if (inCue) {
      // Remove HTML tags and add to current text
      const cleanedLine = line.replace(/<[^>]*>/g, "");
      if (cleanedLine) {
        currentText += (currentText ? " " : "") + cleanedLine;
      }
    }
  }

  // Add the last segment if there's any text
  if (currentText) {
    segments.push({
      timestamp: currentTimestamp,
      text: currentText.trim(),
    });
  }

  return segments;
}

// Function to merge small segments into logical chunks
export function mergeSegmentsIntoChunks(
  segments: TranscriptSegment[],
  targetDuration: number = 60, // Target duration in seconds
): TranscriptSegment[] {
  if (segments.length === 0) return [];

  const chunks: TranscriptSegment[] = [];
  let currentChunk: TranscriptSegment = {
    timestamp: segments[0].timestamp,
    text: "",
  };

  let currentDuration = 0;
  let lastTimestamp = timeToSeconds(segments[0].timestamp);

  for (const segment of segments) {
    const segmentTime = timeToSeconds(segment.timestamp);
    const segmentDuration = segmentTime - lastTimestamp;
    lastTimestamp = segmentTime;

    // If adding this segment would exceed our target duration, start a new chunk
    if (
      currentDuration > 0 && currentDuration + segmentDuration >= targetDuration
    ) {
      chunks.push(currentChunk);
      currentChunk = {
        timestamp: segment.timestamp,
        text: segment.text,
      };
      currentDuration = segmentDuration;
    } else {
      // Otherwise, add this segment to the current chunk
      currentChunk.text += (currentChunk.text ? " " : "") + segment.text;
      currentDuration += segmentDuration;
    }
  }

  // Add the last chunk if it has content
  if (currentChunk.text) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Helper function to convert MM:SS to seconds
function timeToSeconds(timeString: string): number {
  const [minutes, seconds] = timeString.split(":").map(Number);
  return minutes * 60 + seconds;
}

// Function to extract a title for each segment
export async function extractSegmentTitle(
  segment: TranscriptSegment,
): Promise<string> {
  try {
    const promptTemplate = await loadPrompt("segment-title");
    const prompt = promptTemplate.replace("{transcript}", segment.text);

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
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    // Clean up the response to get just the title
    const title = data.response.trim().replace(/^"(.+)"$/, "$1"); // Remove quotes if present
    return title;
  } catch (error) {
    console.error("Error extracting segment title:", error);
    return `Segment at ${segment.timestamp}`;
  }
}
