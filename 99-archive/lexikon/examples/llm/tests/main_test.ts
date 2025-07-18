import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import {
  createLLMClient,
  type LLMConfig,
} from '@lexikon/llm';

Deno.test('llm integration - Claude client creation', () => {
  const config: LLMConfig = {
    apiKey: 'test-key',
    model: 'claude-3-sonnet-20240229',
  };

  const client = createLLMClient('claude', config);
  assertEquals(typeof client.complete, 'function');
});

Deno.test('llm integration - Gemini client creation', () => {
  const config: LLMConfig = {
    apiKey: 'test-key',
    model: 'gemini-pro',
  };

  const client = createLLMClient('gemini', config);
  assertEquals(typeof client.complete, 'function');
}); 