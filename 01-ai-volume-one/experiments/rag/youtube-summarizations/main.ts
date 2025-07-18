import {
  checkRequiredTools,
  extractVideoId,
  parseCommandLineArgs,
  sanitizeFilename,
  startSpinner,
} from "./utils.ts";

import { config } from "./config.ts";
import {
  fetchTranscriptWithYtDlp,
  fetchVideoTitle,
} from "./transcript-extractor.ts";

import {
  extractSegmentTitle,
  extractTranscriptWithTimestamps,
  mergeSegmentsIntoChunks,
  TranscriptSegment,
} from "./transcript-segmenter.ts";

import {
  extractSegmentEntities,
  extractSegmentQuotes,
  extractSegmentTakeaways,
} from "./segment-analysis.ts";

import {
  combineSegmentSummaries,
  generateSegmentSummary,
  SegmentSummary,
} from "./segment-summary.ts";

// Main function with streaming approach
async function main() {
  // Parse command line arguments
  const args = parseCommandLineArgs(Deno.args);
  const youtubeUrl = args.url;
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

  // Try to fetch transcript with timestamps first
  console.log("Fetching transcript with timestamps...");
  let segments: TranscriptSegment[] = [];

  try {
    segments = await extractTranscriptWithTimestamps(videoId);

    // Check if we got any segments
    if (segments.length === 0) {
      throw new Error("No segments extracted with timestamps");
    }
  } catch (error: unknown) {
    console.warn(
      "Could not extract transcript with timestamps. Falling back to regular transcript extraction.",
    );
    if (error instanceof Error) {
      console.warn(error.message);
    } else {
      console.warn(String(error));
    }

    // Fallback to regular transcript extraction
    console.log("Fetching transcript without timestamps...");
    const transcript = await fetchTranscriptWithYtDlp(videoId);

    if (!transcript || transcript.includes("Failed to extract transcript")) {
      console.error(
        "Could not extract transcript. Please check the URL and try again.",
      );
      Deno.exit(1);
    }

    // Create a single segment with the entire transcript
    segments = [{
      timestamp: "00:00",
      text: transcript,
      title: "Full Video",
    }];
  }

  if (segments.length === 0) {
    console.error(
      "Could not extract transcript. Please check the URL and try again.",
    );
    Deno.exit(1);
  }

  console.log(`Extracted ${segments.length} transcript segments`);

  // Merge small segments into logical chunks based on configuration
  const chunks = mergeSegmentsIntoChunks(
    segments,
    config.format.segmentDuration,
  );
  console.log(`Merged into ${chunks.length} logical chunks for processing`);

  // Apply chunk selection if parameters were provided
  let selectedChunks = [...chunks];
  const { startChunk, endChunk, specificChunks } = args;

  if (specificChunks) {
    // Select specific chunks by index
    selectedChunks = specificChunks
      .filter(index => index >= 0 && index < chunks.length)
      .map(index => chunks[index]);
    console.log(`Selected ${selectedChunks.length} specific chunks for processing: ${specificChunks.join(', ')}`);
  } else if (startChunk !== undefined || endChunk !== undefined) {
    // Select chunks by range
    const start = startChunk !== undefined ? Math.max(0, startChunk) : 0;
    const end = endChunk !== undefined ? Math.min(chunks.length - 1, endChunk) : chunks.length - 1;
    
    if (start <= end) {
      selectedChunks = chunks.slice(start, end + 1);
      console.log(`Selected chunks ${start} to ${end} for processing (${selectedChunks.length} chunks)`);
    } else {
      console.error(`Invalid chunk range: ${start} to ${end}`);
      Deno.exit(1);
    }
  }

  // Start spinner for processing indication
  const spinner = startSpinner();

  // Process each chunk independently and generate summaries
  const segmentSummaries: SegmentSummary[] = [];

  for (let i = 0; i < selectedChunks.length; i++) {
    const chunk = selectedChunks[i];
    console.log(
      `\nProcessing segment ${
        i + 1
      }/${selectedChunks.length} at timestamp ${chunk.timestamp}...`,
    );

    try {
      // Extract a title for this segment
      chunk.title = await extractSegmentTitle(chunk);
      console.log(`Segment title: ${chunk.title}`);

      // Extract information from this segment
      const entities = await extractSegmentEntities(chunk);
      const quotes = await extractSegmentQuotes(chunk);
      const takeaways = await extractSegmentTakeaways(chunk);

      // Generate summary for this segment
      const segmentSummary = await generateSegmentSummary(
        chunk,
        entities,
        quotes,
        takeaways,
      );

      segmentSummaries.push(segmentSummary);

      // Show progress
      console.log(`✓ Completed segment ${i + 1}/${chunks.length}`);
    } catch (error: unknown) {
      console.error(`Error processing segment ${i + 1}:`);
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
    }
  }

  // Stop spinner
  clearInterval(spinner);
  Deno.stdout.writeSync(new TextEncoder().encode("\r                      \r"));

  // Combine all segment summaries into a final document
  const fullSummary = combineSegmentSummaries(
    segmentSummaries,
    videoTitle,
    youtubeUrl,
  );

  // Create output file
  const sanitizedTitle = sanitizeFilename(videoTitle);
  const outputFile = `${config.format.outputDir}/${sanitizedTitle}-summary.md`;

  // Ensure output directory exists
  try {
    await Deno.mkdir(config.format.outputDir, { recursive: true });
  } catch (_error) {
    // Directory might already exist, ignore error
  }

  // Write summary to file
  await Deno.writeTextFile(outputFile, fullSummary);

  console.log(`\n✅ Summary saved to ${outputFile}`);
}

// Run the main function
main();
