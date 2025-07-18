import { baseUrl, loadPrompt, modelName } from "./utils.ts";

// Define entity interface
export interface Entities {
  host_name?: string;
  guest_name?: string;
  show_name?: string;
  locations?: string[];
  organizations?: string[];
  dates?: string[];
  key_people?: string[];
  key_projects?: string[];
  [key: string]: string | string[] | undefined;
}

// STAGE 1: Extract key entities from the transcript
export async function extractEntities(text: string): Promise<Entities> {
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
          console.log("Problematic JSON string:", jsonMatch[0]);
          console.log("Attempted fixed JSON:", jsonStr);

          // Return empty object if parsing fails
          return {} as Entities;
        }
      }
      return {} as Entities;
    } catch (error) {
      console.error("Error parsing JSON from entity extraction:", error);
      return {} as Entities;
    }
  } catch (error) {
    console.error("Error extracting entities:", error);
    return {} as Entities;
  }
}

// STAGE 2: Extract key topics from the transcript
export async function extractTopics(text: string): Promise<string[]> {
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
          // 1. Fix missing commas between array elements
          jsonStr = jsonStr.replace(/"\s*"(?!\s*[,\]])/g, '", "');

          // Fix the specific error pattern we're seeing
          // SyntaxError: Expected ',' or ']' after array element in JSON at position 3
          jsonStr = jsonStr.replace(/"([^"]*)"([^,\]])/g, '"$1",$2');

          // 2. Fix repeated quotes
          jsonStr = jsonStr.replace(/""+/g, '"');

          // 3. Fix the specific error we're seeing in the output
          // SyntaxError: Expected ',' or ']' after array element in JSON at position 3 (line 1 column 4)
          // This happens when there's a double quote at the beginning of the string
          if (jsonStr.startsWith('[""')) {
            jsonStr = jsonStr.replace('[""', '["');
          }

          // Fix quotes with repeated text (seen in the error output)
          jsonStr = jsonStr.replace(
            /(\w+\s+because\s+the\s+AI\s+agents\s+can\s+retrieve)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+a\s+new\s+open\s+standard\s+protocol)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+model\s+context\s+protocol\s+or)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+the\s+latest\s+capabilities\s+list\s+from\s+a)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+server\s+each\s+time\s+it\s+connects\s+and\s+that\s+it)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+endpoints\s+and\s+the\s+parameter\s+formats\s+and)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+the\s+authentication\s+schemes\s+they\s+vary)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+APIs\s+under\s+the\s+hood\s+while\s+providing\s+a)\s+\1\s+\1/g,
            "$1",
          );

          // 4. Ensure proper array format
          if (!jsonStr.startsWith("[")) jsonStr = "[" + jsonStr;
          if (!jsonStr.endsWith("]")) jsonStr = jsonStr + "]";

          // Try to parse the JSON
          return JSON.parse(jsonStr);
        } catch (parseError) {
          console.error(
            "Error parsing JSON from topic extraction:",
            parseError,
          );
          console.log("Problematic JSON string:", jsonMatch[0]);
          console.log("Attempted fixed JSON:", jsonStr);

          // Fallback: Try to manually extract topics
          const topics: string[] = [];
          // Look for quoted strings in the response
          const topicMatches = data.response.match(/"([^"]*)"/g);
          if (topicMatches) {
            // Process each match to remove the quotes and add to array
            topicMatches.forEach((topic: string) => {
              // Remove surrounding quotes and add to array
              topics.push(topic.substring(1, topic.length - 1));
            });
            return topics;
          }
        }
      }

      // If no JSON array pattern found, try to extract topics directly
      const topics: string[] = [];
      const topicMatches = data.response.match(/"([^"]*)"/g);
      if (topicMatches) {
        topicMatches.forEach((topic: string) => {
          topics.push(topic.substring(1, topic.length - 1));
        });
        return topics;
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
export async function extractQuotes(text: string): Promise<string[]> {
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
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    try {
      // Log the raw response for debugging
      // console.log("Raw response:", data.response);

      // More robust JSON array extraction
      // Look for array pattern with square brackets
      const jsonMatch = data.response.match(/(\[[\s\S]*?\])/);

      if (jsonMatch && jsonMatch[0]) {
        // Clean the extracted JSON string
        let jsonStr = jsonMatch[0].trim();

        try {
          // Fix common JSON formatting issues
          // 1. Fix missing commas between array elements
          jsonStr = jsonStr.replace(/"\s*"(?!\s*[,\]])/g, '", "');

          // Fix the specific error pattern we're seeing
          // SyntaxError: Expected ',' or ']' after array element in JSON at position 3
          jsonStr = jsonStr.replace(/"([^"]*)"([^,\]])/g, '"$1",$2');

          // 2. Fix repeated quotes
          jsonStr = jsonStr.replace(/""+/g, '"');

          // 3. Fix the specific error we're seeing in the output
          // SyntaxError: Expected ',' or ']' after array element in JSON at position 3 (line 1 column 4)
          // This happens when there's a double quote at the beginning of the string
          if (jsonStr.startsWith('[""')) {
            jsonStr = jsonStr.replace('[""', '["');
          }

          // Fix quotes with repeated text (seen in the error output)
          jsonStr = jsonStr.replace(
            /(\w+\s+because\s+the\s+AI\s+agents\s+can\s+retrieve)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+a\s+new\s+open\s+standard\s+protocol)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+model\s+context\s+protocol\s+or)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+the\s+latest\s+capabilities\s+list\s+from\s+a)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+server\s+each\s+time\s+it\s+connects\s+and\s+that\s+it)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+endpoints\s+and\s+the\s+parameter\s+formats\s+and)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+the\s+authentication\s+schemes\s+they\s+vary)\s+\1\s+\1/g,
            "$1",
          );
          jsonStr = jsonStr.replace(
            /(\w+\s+APIs\s+under\s+the\s+hood\s+while\s+providing\s+a)\s+\1\s+\1/g,
            "$1",
          );

          // 4. Ensure proper array format
          if (!jsonStr.startsWith("[")) jsonStr = "[" + jsonStr;
          if (!jsonStr.endsWith("]")) jsonStr = jsonStr + "]";

          // Try to parse the JSON
          return JSON.parse(jsonStr);
        } catch (parseError) {
          console.error(
            "Error parsing JSON from quote extraction:",
            parseError,
          );
          console.log("Problematic JSON string:", jsonMatch[0]);
          console.log("Attempted fixed JSON:", jsonStr);

          // Fallback: Try to manually extract quotes
          const quotes: string[] = [];
          // Look for quoted strings in the response
          const quoteMatches = data.response.match(/"([^"]*)"/g);
          if (quoteMatches) {
            // Process each match to remove the quotes and add to array
            quoteMatches.forEach((quote: string) => {
              // Remove surrounding quotes and add to array
              quotes.push(quote.substring(1, quote.length - 1));
            });
            return quotes;
          }

          // Return empty array if all extraction methods fail
          return [];
        }
      }

      // If no JSON array pattern found, try to extract quotes directly
      const quotes: string[] = [];
      const quoteMatches = data.response.match(/"([^"]*)"/g);
      if (quoteMatches) {
        quoteMatches.forEach((quote: string) => {
          quotes.push(quote.substring(1, quote.length - 1));
        });
        return quotes;
      }

      return [];
    } catch (error) {
      console.error("Error processing quote extraction response:", error);
      return [];
    }
  } catch (error) {
    console.error("Error extracting quotes:", error);
    return [];
  }
}

// FINAL STAGE: Generate summary using extracted information
export async function generateSummary(
  transcript: string,
  entities: Entities,
  topics: string[],
  quotes: string[],
): Promise<string> {
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
      quotes: quotes,
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
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary.";
  }
}
