/// <reference lib="deno.ns" />

import { createMixtralClient } from '../mod.ts';

// Simple streaming chat example using Mixtral through Groq
async function main() {
  try {
    // Initialize the client
    const client = createMixtralClient({
      apiKey: Deno.env.get('GROQ_API_KEY') || '',
      temperature: 0.7,
      maxTokens: 1000,
    });

    console.log('Sending request...\n');

    // Get the streaming completion
    const stream = client.streamComplete(
      'Write a short story about a programmer who discovers an AI living in their codebase. Make it engaging and format it with proper paragraphs.'
    );
    
    // Process the stream
    console.log('Mixtral\'s response:\n');
    
    const encoder = new TextEncoder();
    let hadError = false;
    
    try {
      for await (const chunk of stream) {
        // Print each chunk as it arrives
        if (chunk) {
          await Deno.stdout.write(encoder.encode(chunk));
        }
      }
      
    } catch (error) {
      hadError = true;
      console.error('\n\nError in stream processing:');
      if (error instanceof Error) {
        console.error('- Message:', error.message);
        if (error.stack) {
          console.error('- Stack:', error.stack);
        }
        if ('cause' in error) {
          console.error('- Cause:', error.cause);
        }
      } else {
        console.error('Unknown error occurred:', error);
      }
    } finally {
      if (hadError) {
        console.error('\nNote: The response may be incomplete due to streaming errors');
      }
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

// Run the example
if (import.meta.url === Deno.mainModule) {
  await main();
} 