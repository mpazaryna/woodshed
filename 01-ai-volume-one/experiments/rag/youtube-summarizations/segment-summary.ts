// segment-summary.ts
// This file contains functions for generating summaries of transcript segments

import { baseUrl, loadPrompt, modelName } from "./utils.ts";
import { TranscriptSegment } from "./transcript-segmenter.ts";
import { Entities } from "./analysis.ts";

// Interface for a segment summary
export interface SegmentSummary {
  timestamp: string;
  title: string;
  quote?: string;
  summary: string;
  takeaways: string[];
}

// Generate a summary for a single segment
export async function generateSegmentSummary(
  segment: TranscriptSegment,
  entities: Entities,
  quotes: string[],
  takeaways: string[],
): Promise<SegmentSummary> {
  try {
    console.log(`Generating summary for segment at ${segment.timestamp}...`);

    // Create a simplified representation of the analysis to include in the prompt
    const analysisData = {
      host: entities.host_name || "The host",
      guest: entities.guest_name || "The guest",
      show_name: entities.show_name || "this show",
      locations: entities.locations || [],
      organizations: entities.organizations || [],
      key_people: entities.key_people || [],
      quotes: quotes,
      takeaways: takeaways,
    };

    const promptTemplate = await loadPrompt("segment-summary");
    const prompt = promptTemplate
      .replace("{analysis_data}", JSON.stringify(analysisData, null, 2))
      .replace("{transcript}", segment.text);

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
    const summaryText = data.response.trim();

    // Select a quote if available
    const selectedQuote = quotes.length > 0 ? quotes[0] : undefined;

    return {
      timestamp: segment.timestamp,
      title: segment.title || `Segment at ${segment.timestamp}`,
      quote: selectedQuote,
      summary: summaryText,
      takeaways: takeaways,
    };
  } catch (error) {
    console.error(
      `Error generating summary for segment at ${segment.timestamp}:`,
      error,
    );
    return {
      timestamp: segment.timestamp,
      title: segment.title || `Segment at ${segment.timestamp}`,
      summary: "Failed to generate summary for this segment.",
      takeaways: takeaways,
    };
  }
}

// Combine all segment summaries into a final document
export function combineSegmentSummaries(
  summaries: SegmentSummary[],
  videoTitle: string,
  videoUrl: string,
): string {
  let markdown = `# YouTube Video Summary: ${videoTitle}\n\n`;
  markdown += `## Video URL\n[${videoUrl}](${videoUrl})\n\n`;

  // Add each segment summary
  for (const summary of summaries) {
    markdown += `## ${summary.timestamp} ${summary.title}\n\n`;

    // Add quote if available
    if (summary.quote) {
      markdown += `> "${summary.quote}"\n\n`;
    }

    // Add summary text
    markdown += `${summary.summary}\n\n`;

    // Add takeaways if available
    if (summary.takeaways && summary.takeaways.length > 0) {
      markdown += `### Takeaways\n\n`;
      for (const takeaway of summary.takeaways) {
        markdown += `* ${takeaway}\n`;
      }
      markdown += "\n";
    }

    // Add separator between segments
    markdown += "---\n\n";
  }

  // Add generation timestamp
  markdown += `*Generated on ${new Date().toISOString().split("T")[0]}*\n`;

  return markdown;
}
