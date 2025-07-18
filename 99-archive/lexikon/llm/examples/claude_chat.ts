/// <reference lib="deno.ns" />

import { createClaudeClient, type Message } from "../mod.ts";

// Simple command line chat example using Claude
async function main() {
  try {
    // Initialize the client
    const client = createClaudeClient({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY") || "",
      model: "claude-3-sonnet-20240229",
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Prepare the message
    const messages: Message[] = [{
      role: "user",
      content: "What are three interesting facts about Deno?",
    }];

    // Get the completion
    const completion = await client.complete(messages);
    
    // Print the response and token usage
    console.log("\nAssistant's response:\n");
    console.log(completion.message.content);
    console.log("\nToken usage:", completion.usage);
    
  } catch (error) {
    console.error("Error:", error.message);
    Deno.exit(1);
  }
}

// Run the example
if (import.meta.main) {
  await main();
} 