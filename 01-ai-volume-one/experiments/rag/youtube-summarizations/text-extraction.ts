// text-extraction.ts
// This file contains functions for extracting information using plain text format

import { baseUrl, loadPrompt, modelName } from "./utils.ts";
import { TranscriptSegment } from "./transcript-segmenter.ts";
import { Entities } from "./analysis.ts";

// Extract entities using plain text format
export async function extractEntitiesPlainText(segment: TranscriptSegment): Promise<Entities> {
  try {
    console.log(`Extracting entities for segment at ${segment.timestamp} (plain text)...`);
    
    const prompt = `
You are an expert entity extractor. Review this transcript and identify ONLY the key entities mentioned.
Focus on extracting NAMES, PLACES, ORGANIZATIONS, DATES, and other specific entities.
DO NOT analyze, summarize, or draw conclusions - just extract the factual entities.

Format your response with clear headings for each category:

HOST NAME:
[Name of the host, if mentioned]

GUEST NAME:
[Name of the interviewee, if mentioned]

SHOW NAME:
[Name of the podcast/show, if mentioned]

LOCATIONS:
- [Location 1]
- [Location 2]
...

ORGANIZATIONS:
- [Organization 1]
- [Organization 2]
...

DATES:
- [Date 1]
- [Date 2]
...

KEY PEOPLE:
- [Person 1]
- [Person 2]
...

KEY PROJECTS:
- [Project 1]
- [Project 2]
...

TRANSCRIPT:
${segment.text}
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
    const responseText = data.response;
    
    // Parse the plain text response into an Entities object
    const entities: Entities = {};
    
    // Extract host name
    const hostMatch = responseText.match(/HOST NAME:\s*([^\n]+)/);
    if (hostMatch && hostMatch[1].trim() && !hostMatch[1].includes("[Name")) {
      entities.host_name = hostMatch[1].trim();
    }
    
    // Extract guest name
    const guestMatch = responseText.match(/GUEST NAME:\s*([^\n]+)/);
    if (guestMatch && guestMatch[1].trim() && !guestMatch[1].includes("[Name")) {
      entities.guest_name = guestMatch[1].trim();
    }
    
    // Extract show name
    const showMatch = responseText.match(/SHOW NAME:\s*([^\n]+)/);
    if (showMatch && showMatch[1].trim() && !showMatch[1].includes("[Name")) {
      entities.show_name = showMatch[1].trim();
    }
    
    // Extract locations
    entities.locations = extractListItems(responseText, "LOCATIONS:");
    
    // Extract organizations
    entities.organizations = extractListItems(responseText, "ORGANIZATIONS:");
    
    // Extract dates
    entities.dates = extractListItems(responseText, "DATES:");
    
    // Extract key people
    entities.key_people = extractListItems(responseText, "KEY PEOPLE:");
    
    // Extract key projects
    entities.key_projects = extractListItems(responseText, "KEY PROJECTS:");
    
    return entities;
  } catch (error) {
    console.error("Error extracting entities with plain text:", error);
    return {} as Entities;
  }
}

// Extract quotes using plain text format
export async function extractQuotesPlainText(segment: TranscriptSegment): Promise<string[]> {
  try {
    console.log(`Extracting quotes for segment at ${segment.timestamp} (plain text)...`);
    
    const prompt = `
You are an expert quote extractor. Review this transcript and identify 2-3 significant quotes that capture important moments or insights.
Choose quotes that are meaningful and representative of key points in the conversation.
Extract the quotes VERBATIM from the transcript - do not modify them.

Format your response with one quote per line, each starting with "QUOTE: "

TRANSCRIPT SEGMENT:
${segment.text}

QUOTES:
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
    const responseText = data.response;
    
    // Extract quotes from the response
    const quotes: string[] = [];
    const quoteLines = responseText.split("\n");
    
    for (const line of quoteLines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("QUOTE:")) {
        const quote = trimmedLine.substring(6).trim();
        if (quote) {
          quotes.push(quote);
        }
      } else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        // Also handle bullet points
        const quote = trimmedLine.substring(2).trim();
        if (quote) {
          quotes.push(quote);
        }
      } else if (trimmedLine.startsWith('"') && trimmedLine.endsWith('"')) {
        // Also handle quoted text
        const quote = trimmedLine.substring(1, trimmedLine.length - 1).trim();
        if (quote) {
          quotes.push(quote);
        }
      }
    }
    
    return quotes;
  } catch (error) {
    console.error("Error extracting quotes with plain text:", error);
    return [];
  }
}

// Extract takeaways using plain text format
export async function extractTakeawaysPlainText(segment: TranscriptSegment): Promise<string[]> {
  try {
    console.log(`Extracting takeaways for segment at ${segment.timestamp} (plain text)...`);
    
    const prompt = `
You are an expert content analyzer. Extract 3-5 key takeaways from this transcript segment.
Each takeaway should be a concise, specific point that captures important information from the segment.

Format your response with one takeaway per line, each starting with "TAKEAWAY: "

TRANSCRIPT SEGMENT:
${segment.text}

TAKEAWAYS:
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
    const responseText = data.response;
    
    // Extract takeaways from the response
    const takeaways: string[] = [];
    const takeawayLines = responseText.split("\n");
    
    for (const line of takeawayLines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("TAKEAWAY:")) {
        const takeaway = trimmedLine.substring(9).trim();
        if (takeaway) {
          takeaways.push(takeaway);
        }
      } else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        // Also handle bullet points
        const takeaway = trimmedLine.substring(2).trim();
        if (takeaway) {
          takeaways.push(takeaway);
        }
      } else if (/^\d+\./.test(trimmedLine)) {
        // Also handle numbered lists
        const takeaway = trimmedLine.replace(/^\d+\.\s*/, "").trim();
        if (takeaway) {
          takeaways.push(takeaway);
        }
      }
    }
    
    return takeaways;
  } catch (error) {
    console.error("Error extracting takeaways with plain text:", error);
    return [];
  }
}

// Helper function to extract list items from a section
function extractListItems(text: string, sectionHeader: string): string[] {
  const items: string[] = [];
  
  // Find the section
  const sectionRegex = new RegExp(`${sectionHeader}([\\s\\S]*?)(?=\\n\\n|\\n[A-Z\\s]+:|$)`);
  const sectionMatch = text.match(sectionRegex);
  
  if (sectionMatch && sectionMatch[1]) {
    const sectionContent = sectionMatch[1].trim();
    const lines = sectionContent.split("\n");
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        const item = trimmedLine.substring(2).trim();
        if (item && !item.includes("[") && !item.includes("None") && !item.includes("N/A")) {
          items.push(item);
        }
      }
    }
  }
  
  return items;
}
