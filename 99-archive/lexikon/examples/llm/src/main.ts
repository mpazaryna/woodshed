/// <reference lib="deno.ns" />

import {
  createLLMClient,
  type Message,
  type ModelProvider,
  type LLMConfig,
  logger,
  type LogEvent,
} from '@lexikon/llm';
import { createDailyRotatingFileLogger } from './utils/file_logger.ts';

// Example custom log handler that formats logs nicely for console
function consoleLogHandler(event: LogEvent) {
  const metadata = event.metadata ? ` | metadata: ${JSON.stringify(event.metadata)}` : '';
  console.log(`[${event.timestamp}] ${event.level.toUpperCase()}: ${event.message}${metadata}`);
}

async function testProvider(
  provider: ModelProvider,
  model: string,
  prompt: string,
) {
  console.log(`\nTesting ${provider} with model ${model}:`);
  console.log('Prompt:', prompt);

  // Configure logging - set to debug level to see all logs
  if (provider === 'claude') {
    // Note: In Deno, environment variables are read-only in web workers
    // This is just for demonstration - in production, set this via command line
    console.log('Note: Set LLM_LOG_LEVEL=debug for more detailed logs');
  }

  // Add our custom handlers for both console and file logging
  const fileLogger = createDailyRotatingFileLogger();
  logger.addHandler(consoleLogHandler);
  logger.addHandler(fileLogger);

  // Disable default console logging since we have our own handler
  logger.setConsoleLogging(false);

  const config: LLMConfig = {
    apiKey: provider === 'claude' 
      ? Deno.env.get('ANTHROPIC_API_KEY') || ''
      : Deno.env.get('GOOGLE_API_KEY') || '',
    model,
    maxTokens: 100,
    temperature: 0.7,
  };

  const client = createLLMClient(provider, config);
  const messages: Message[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  try {
    const completion = await client.complete(messages);
    console.log('\nResponse:', completion.message.content);
    console.log('Token Usage:', completion.usage);
  } catch (error) {
    console.error(`Error with ${provider}:`, error.message);
  } finally {
    // Clean up by removing our handlers
    logger.removeHandler(consoleLogHandler);
    logger.removeHandler(fileLogger);
  }
}

// Test both providers
async function main() {
  const prompt = 'Write a haiku about coding.';

  // Test Claude with debug logging enabled
  await testProvider('claude', 'claude-3-sonnet-20240229', prompt);
  
  // Test Gemini with info level logging (default)
  await testProvider('gemini', 'gemini-pro', prompt);
}

// Run the tests
main().catch(console.error); 