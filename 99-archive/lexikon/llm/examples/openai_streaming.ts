/// <reference lib="deno.ns" />

import { createOpenAIClient, type Message } from '../mod.ts';

// Simple streaming chat example
async function main() {
  try {
    // Initialize the client with trimmed API key
    const client = createOpenAIClient({
      apiKey: Deno.env.get('OPENROUTER_API_KEY')?.trim() || '',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Prepare a longer message to demonstrate streaming
    const messages: Message[] = [{
      role: 'user',
      content: 'Write a short story about a programmer who discovers an AI living in their codebase. Make it engaging and format it with proper paragraphs.',
    }];

    console.log('Sending request...\n');

    // Get the streaming completion
    const stream = client.completeStream(messages);
    
    // Process the stream
    console.log('Assistant\'s response:\n');
    
    const encoder = new TextEncoder();
    let finalUsage;
    
    try {
      for await (const chunk of stream) {
        // Print each chunk as it arrives
        await Deno.stdout.write(encoder.encode(chunk.message.content));
        
        // Keep track of the final usage stats
        if (chunk.usage) {
          finalUsage = chunk.usage;
        }
      }
      
      // Print final usage information
      if (finalUsage) {
        console.log('\n\nToken usage:');
        console.log(`- Prompt tokens: ${finalUsage.promptTokens}`);
        console.log(`- Completion tokens: ${finalUsage.completionTokens}`);
        console.log(`- Total tokens: ${finalUsage.totalTokens}`);
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