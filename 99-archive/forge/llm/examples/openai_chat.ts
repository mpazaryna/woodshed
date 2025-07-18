/// <reference lib="deno.ns" />

import { createOpenAIClient, type Message } from '../mod.ts';

// Simple command line chat example using OpenAI GPT-3.5
async function main() {
  try {
    // Initialize the client
    const client = createOpenAIClient({
      apiKey: Deno.env.get('OPENROUTER_API_KEY')?.trim() || '',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Prepare the message
    const messages: Message[] = [{
      role: 'user',
      content: 'What are three interesting facts about TypeScript?'
    }];

    // Get the completion
    const response = await client.complete(messages);
    
    // Print the response
    console.log('\nAssistant\'s response:\n');
    console.log(response.message.content);
    
    // Print usage information if available
    if (response.usage) {
      console.log('\nToken usage:');
      console.log(`- Prompt tokens: ${response.usage.promptTokens}`);
      console.log(`- Completion tokens: ${response.usage.completionTokens}`);
      console.log(`- Total tokens: ${response.usage.totalTokens}`);
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

// Run the example
if (import.meta.url === Deno.mainModule) {
  await main();
} 