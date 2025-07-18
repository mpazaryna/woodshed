// segment-analysis.ts
// This file contains functions for analyzing individual transcript segments

import { baseUrl, loadPrompt, modelName } from "./utils.ts";
import { config } from "./config.ts";
import { TranscriptSegment } from "./transcript-segmenter.ts";
import { Entities } from "./analysis.ts";
import {
  extractEntitiesPlainText,
  extractQuotesPlainText,
  extractTakeawaysPlainText,
} from "./text-extraction.ts";

// Interface for segment analysis results
export interface SegmentAnalysis {
  entities: Entities;
  quotes: string[];
  takeaways: string[];
}

// Extract key entities from a segment
export function extractSegmentEntities(
  segment: TranscriptSegment,
): Promise<Entities> {
  // Use either JSON or plain text extraction based on configuration
  if (config.format.useJson) {
    return extractSegmentEntitiesJson(segment);
  } else {
    return extractEntitiesPlainText(segment);
  }
}

// Extract key entities from a segment using JSON format
async function extractSegmentEntitiesJson(
  segment: TranscriptSegment,
): Promise<Entities> {
  try {
    console.log(
      `Extracting entities for segment at ${segment.timestamp} (JSON)...`,
    );

    const promptTemplate = await loadPrompt("entity-extraction");
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
    try {
      // Find the JSON in the response
      const jsonMatch = data.response.match(/(\{[\s\S]*?\})/);
      if (jsonMatch && jsonMatch[0]) {
        // Clean the extracted JSON string
        let jsonStr = jsonMatch[0].trim();

        try {
          // Fix common JSON formatting issues
          // 1. Fix missing commas between properties
          jsonStr = jsonStr.replace(/"\s*"(?!\s*[,\}])/g, '", "');

          // 2. Fix repeated quotes
          jsonStr = jsonStr.replace(/""+/g, '"');

          // 3. Ensure proper object format
          if (!jsonStr.startsWith("{")) jsonStr = "{" + jsonStr;
          if (!jsonStr.endsWith("}")) jsonStr = jsonStr + "}";

          // Try to parse the JSON
          return JSON.parse(jsonStr) as Entities;
        } catch (parseError) {
          console.error(
            "Error parsing JSON from entity extraction:",
            parseError,
          );
          console.log(
            "Falling back to plain text extraction due to JSON parsing error",
          );
          return extractEntitiesPlainText(segment);
        }
      }
      console.log(
        "No JSON found in response, falling back to plain text extraction",
      );
      return extractEntitiesPlainText(segment);
    } catch (error) {
      console.error("Error parsing JSON from entity extraction:", error);
      console.log("Falling back to plain text extraction due to error");
      return extractEntitiesPlainText(segment);
    }
  } catch (error) {
    console.error("Error extracting entities with JSON:", error);
    console.log("Falling back to plain text extraction due to error");
    return extractEntitiesPlainText(segment);
  }
}

// Extract notable quotes from a segment
export function extractSegmentQuotes(
  segment: TranscriptSegment,
): Promise<string[]> {
  // Use either JSON or plain text extraction based on configuration
  if (config.format.useJson) {
    return extractSegmentQuotesJson(segment);
  } else {
    return extractQuotesPlainText(segment);
  }
}

// Extract notable quotes from a segment using JSON format
async function extractSegmentQuotesJson(
  segment: TranscriptSegment,
): Promise<string[]> {
  try {
    console.log(
      `Extracting quotes for segment at ${segment.timestamp} (JSON)...`,
    );

    const promptTemplate = await loadPrompt("quote-extraction");
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

    try {
      // Find the JSON array in the response
      const jsonMatch = data.response.match(/(\[[\s\S]*?\])/);
      if (jsonMatch && jsonMatch[0]) {
        // Clean the extracted JSON string
        let jsonStr = jsonMatch[0].trim();

        try {
          // Fix common JSON formatting issues
          jsonStr = jsonStr.replace(/"\s*"(?!\s*[,\]])/g, '", "');
          jsonStr = jsonStr.replace(/"([^"]*)"([^,\]])/g, '"$1",$2');
          jsonStr = jsonStr.replace(/""+/g, '"');

          // Ensure proper array format
          if (!jsonStr.startsWith("[")) jsonStr = "[" + jsonStr;
          if (!jsonStr.endsWith("]")) jsonStr = jsonStr + "]";

          // Try to parse the JSON
          return JSON.parse(jsonStr);
        } catch (parseError) {
          console.error(
            "Error parsing JSON from quote extraction:",
            parseError,
          );
          console.log(
            "Falling back to plain text extraction due to JSON parsing error",
          );
          return extractQuotesPlainText(segment);
        }
      }

      console.log(
        "No JSON array found in response, falling back to plain text extraction",
      );
      return extractQuotesPlainText(segment);
    } catch (error) {
      console.error("Error processing quote extraction response:", error);
      console.log("Falling back to plain text extraction due to error");
      return extractQuotesPlainText(segment);
    }
  } catch (error) {
    console.error("Error extracting quotes with JSON:", error);
    console.log("Falling back to plain text extraction due to error");
    return extractQuotesPlainText(segment);
  }
}

// Extract key takeaways from a segment
export function extractSegmentTakeaways(
  segment: TranscriptSegment,
): Promise<string[]> {
  // Use either JSON or plain text extraction based on configuration
  if (config.format.useJson) {
    return extractSegmentTakeawaysJson(segment);
  } else {
    return extractTakeawaysPlainText(segment);
  }
}

// Extract key takeaways from a segment using JSON format
async function extractSegmentTakeawaysJson(
  segment: TranscriptSegment,
): Promise<string[]> {
  try {
    console.log(
      `Extracting takeaways for segment at ${segment.timestamp} (JSON)...`,
    );

    const promptTemplate = await loadPrompt("takeaways-extraction");
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

    try {
      // Find the JSON array in the response
      const jsonMatch = data.response.match(/(\[[\s\S]*?\])/);
      if (jsonMatch && jsonMatch[0]) {
        // Clean the extracted JSON string
        let jsonStr = jsonMatch[0].trim();

        try {
          // Fix common JSON formatting issues
          jsonStr = jsonStr.replace(/"\s*"(?!\s*[,\]])/g, '", "');
          jsonStr = jsonStr.replace(/"([^"]*)"([^,\]])/g, '"$1",$2');
          jsonStr = jsonStr.replace(/""+/g, '"');

          // Ensure proper array format
          if (!jsonStr.startsWith("[")) jsonStr = "[" + jsonStr;
          if (!jsonStr.endsWith("]")) jsonStr = jsonStr + "]";

          // Try to parse the JSON
          return JSON.parse(jsonStr);
        } catch (parseError) {
          console.error(
            "Error parsing JSON from takeaways extraction:",
            parseError,
          );
          console.log(
            "Falling back to plain text extraction due to JSON parsing error",
          );
          return extractTakeawaysPlainText(segment);
        }
      }

      console.log(
        "No JSON array found in response, falling back to plain text extraction",
      );
      return extractTakeawaysPlainText(segment);
    } catch (error) {
      console.error("Error processing takeaways extraction response:", error);
      console.log("Falling back to plain text extraction due to error");
      return extractTakeawaysPlainText(segment);
    }
  } catch (error) {
    console.error("Error extracting takeaways with JSON:", error);
    console.log("Falling back to plain text extraction due to error");
    return extractTakeawaysPlainText(segment);
  }
}
