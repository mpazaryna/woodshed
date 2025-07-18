/// <reference lib="deno.ns" />

import { createDeepSeekClient } from '../mod.ts';

// Simple command line chat example using DeepSeek through Groq
async function main() {
  try {
    // Initialize the client
    const client = createDeepSeekClient({
      apiKey: Deno.env.get('GROQ_API_KEY') || '',
      temperature: 0.6,
      maxTokens: 4096,
      topP: 0.95,
    });

    // Get the completion
    const response = await client.complete(
      'What are three interesting facts about Deno?'
    );
    
    // Print the response
    console.log('\nDeepSeek\'s response:\n');
    console.log(response);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
if (import.meta.url === Deno.mainModule) {
  await main();
} 