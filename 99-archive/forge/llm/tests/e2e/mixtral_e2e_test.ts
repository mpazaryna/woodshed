import { assert } from 'std/assert/mod.ts';
import { createMixtralClient } from '@forge/llm';

// Helper to add delay between API calls to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple completion test
Deno.test({
  name: 'e2e: mixtral simple completion',
  ignore: !Deno.env.get('GROQ_API_KEY'),
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const client = createMixtralClient({
      apiKey: Deno.env.get('GROQ_API_KEY') || '',
      temperature: 0,
      maxTokens: 100,
    });

    const result = await client.complete('What is 2+2? Reply with just the number.');
    
    assert(result.includes('4'), 'Response should include the number 4');
    await delay(1000); // Add delay between tests
  },
});

// Simple streaming test
Deno.test({
  name: 'e2e: mixtral simple streaming',
  ignore: !Deno.env.get('GROQ_API_KEY'),
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const client = createMixtralClient({
      apiKey: Deno.env.get('GROQ_API_KEY') || '',
      temperature: 0,
      maxTokens: 100,
    });

    const stream = client.streamComplete('Count from 1 to 3.');
    const chunks: string[] = [];
    
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    assert(chunks.length > 0, 'Should receive at least one chunk');
    const fullResponse = chunks.join('');
    assert(fullResponse.length > 0, 'Combined response should have content');
    assert(
      /1.*2.*3/.test(fullResponse.replace(/\s+/g, ' ')),
      'Response should contain numbers 1, 2, and 3'
    );
    await delay(1000); // Add delay between tests
  },
});

// Temperature test
Deno.test({
  name: 'e2e: mixtral with temperature',
  ignore: !Deno.env.get('GROQ_API_KEY'),
  sanitizeOps: false,
  sanitizeResources: false,
  async fn() {
    const client = createMixtralClient({
      apiKey: Deno.env.get('GROQ_API_KEY') || '',
      temperature: 0.1, // More deterministic
      maxTokens: 10,
    });

    const result = await client.complete('Write one word: hello');
    assert(result.length > 0, 'Should get a response');
    // Check that the response is relatively short, but be more lenient
    assert(result.split(/\s+/).length <= 10, 'Response should be relatively short');
  },
}); 