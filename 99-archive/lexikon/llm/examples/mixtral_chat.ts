/// <reference lib="deno.ns" />

import { createMixtralClient } from '../mod.ts';

// Simple command line chat example using Mixtral through Groq
async function main() {
  try {
    // Initialize the client
    const client = createMixtralClient({
      apiKey: Deno.env.get('GROQ_API_KEY') || '',
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Get the completion
    const response = await client.complete(
      'What are three interesting facts about Deno?'
    );
    
    // Print the response
    console.log('\nMixtral\'s response:\n');
    console.log(response);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
if (import.meta.url === Deno.mainModule) {
  await main();
} 