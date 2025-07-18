// recipe_insights.ts

/**
 * This module provides functionality for generating insights from recipe data using OpenAI's language model.
 * 
 * It directly interacts with OpenAI's API to process recipe information.
 * The module includes logging capabilities for tracking the execution flow and debugging purposes.
 */

import OpenAI from "https://deno.land/x/openai@v4.20.1/mod.ts";
import * as log from "https://deno.land/std@0.192.0/log/mod.ts";

// Configure logging
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
    file: new log.handlers.FileHandler("INFO", {
      filename: "./app.log",
      formatter: "{levelName} {datetime} {msg}",
    }),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console", "file"],
    },
  },
});

const client = new OpenAI();

/**
 * Generate insights from a given set of recipes using OpenAI's language model.
 * 
 * This function takes a summary of recipe data as input and uses OpenAI's GPT model to generate
 * insights about trends in cuisine types, popular ingredients, and cooking methods. It aims to
 * provide exactly 5 concise insights, formatted as 'Insight X: Your insight here'.
 * 
 * @param recipes A string containing a summary of recipe data.
 * @returns A dictionary containing at least 3 insights. Keys are formatted as 'insight_1',
 *          'insight_2', etc., and values are the corresponding insight texts.
 * 
 * Note:
 *     If the OpenAI model generates fewer than 3 insights, the function will pad the result
 *     with placeholder insights to ensure at least 3 are returned.
 */
export async function generateInsights(recipes: string): Promise<Record<string, string>> {
  log.info("Starting generateInsights function");
  log.info(`Input recipes: ${recipes}`);

  const prompt = `Based on the following recipe data summary, please provide exactly 5 concise insights about trends in cuisine types, popular ingredients, and cooking methods. Format each insight as 'Insight X: Your insight here', where X is the number of the insight.\n\n${recipes}`;

  log.info("Sending request to OpenAI");
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-1106-preview",
  });

  const response = chatCompletion.choices[0].message.content;
  log.info(`Generated insights from OpenAI: ${response}`);

  // Parse the response into a dictionary
  const insights: Record<string, string> = {};
  if (response) {
    response.split("\n").forEach((line) => {
      if (line.startsWith("Insight")) {
        const [key, value] = line.split(":", 2);
        insights[key.trim().toLowerCase().replace(" ", "_")] = value.trim();
      }
    });
  }

  // Ensure we have at least 3 insights
  for (let i = 1; Object.keys(insights).length < 3; i++) {
    insights[`insight_${i}`] = "No insight provided";
  }

  log.info(`Parsed insights: ${JSON.stringify(insights)}`);
  log.info("Finished generateInsights function");

  return insights;
}