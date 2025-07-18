import { assert, assertEquals, assertExists } from 'std/assert/mod.ts';
import { createDeepSeekClient } from '@forge/llm';

// Helper to add delay between API calls to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple completion test
Deno.test({
  name: 'e2e: deepseek simple completion',
  ignore: !Deno.env.get('GROQ_API_KEY'),
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const client = createDeepSeekClient({
      apiKey: Deno.env.get('GROQ_API_KEY') || '',
      temperature: 0,
      maxTokens: 100,
    });

    const result = await client.complete('What is 2+2? Reply with just the number.');
    
    assert(result.length > 0, 'Response should not be empty');
    await delay(1000); // Add delay between tests
  },
});

// Simple streaming test
Deno.test({
  name: 'e2e: deepseek simple streaming',
  ignore: !Deno.env.get('GROQ_API_KEY'),
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const client = createDeepSeekClient({
      apiKey: Deno.env.get('GROQ_API_KEY') || '',
      temperature: 0,
      maxTokens: 100,
    });

    const stream = client.streamComplete('Tell me something interesting.');
    const chunks: string[] = [];
    
    for await (const chunk of stream) {
      assertExists(chunk);
      assertEquals(typeof chunk, "string");
      assert(chunk.length > 0, 'Each chunk should have content');
      chunks.push(chunk);
    }

    assert(chunks.length > 0, 'Should receive at least one chunk');
    const fullResponse = chunks.join('');
    assert(fullResponse.length > 0, 'Combined response should have content');
    await delay(1000); // Add delay between tests
  },
});

// Temperature and topP test
Deno.test({
  name: 'e2e: deepseek with temperature and topP',
  ignore: !Deno.env.get('GROQ_API_KEY'),
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const client = createDeepSeekClient({
      apiKey: Deno.env.get('GROQ_API_KEY') || '',
      temperature: 0.1, // More deterministic
      maxTokens: 10,
      topP: 0.95, // DeepSeek specific parameter
    });

    const result = await client.complete('Write one word: hello');
    assert(result.length > 0, 'Should get a response');
    // Check that the response is relatively short, but be more lenient
    assert(result.split(/\s+/).length <= 10, 'Response should be relatively short');
  },
}); 