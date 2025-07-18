/// <reference lib="deno.ns" />

import { createDeepSeekClient } from '../mod.ts';

// Simple streaming chat example using DeepSeek through Groq
async function main() {
  try {
    // Initialize the client
    const client = createDeepSeekClient({
      apiKey: Deno.env.get('GROQ_API_KEY') || '',
      temperature: 0.6,
      maxTokens: 4096,
      topP: 0.95,
    });

    console.log('Sending request...\n');

    // Get the streaming completion
    const stream = client.streamComplete(
      'Write a short story about a programmer who discovers an AI living in their codebase. Make it engaging and format it with proper paragraphs.'
    );
    
    // Process the stream
    console.log('DeepSeek\'s response:\n');
    
    const encoder = new TextEncoder();
    
    try {
      for await (const chunk of stream) {
        // Print each chunk as it arrives
        await Deno.stdout.write(encoder.encode(chunk));
      }
      
    } catch (error) {
      if (error instanceof Error) {
        console.error('\n\nStreaming error:', error.message);
      } else {
        console.error('\n\nUnknown streaming error occurred');
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