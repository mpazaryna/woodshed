import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import {
  createLLMClient,
  type Message,
  type ModelProvider,
  LLMError,
  type LLMConfig,
} from '@forge/llm'

Deno.test('module e2e - createLLMClient with Claude', async () => {
  const provider: ModelProvider = 'claude'
  const config: LLMConfig = {
    apiKey: Deno.env.get('ANTHROPIC_API_KEY') || '',
    model: 'claude-3-sonnet-20240229',
    maxTokens: 100,
    temperature: 0.7,
  }

  const client = createLLMClient(provider, config)
  const messages: Message[] = [
    {
      role: 'user',
      content: 'Say hello in exactly 5 words.',
    },
  ]

  const completion = await client.complete(messages)

  // Verify response structure
  assertEquals(typeof completion.message.content, 'string')
  assertEquals(completion.message.role, 'assistant')
  assertEquals(typeof completion.usage.promptTokens, 'number')
  assertEquals(typeof completion.usage.completionTokens, 'number')
  assertEquals(typeof completion.usage.totalTokens, 'number')
})

Deno.test('module e2e - createLLMClient with Gemini', async () => {
  const provider: ModelProvider = 'gemini'
  const config: LLMConfig = {
    apiKey: Deno.env.get('GOOGLE_API_KEY') || '',
    model: 'gemini-1.5-pro',
    maxTokens: 100,
    temperature: 0.7,
  }

  const client = createLLMClient(provider, config)
  const messages: Message[] = [
    {
      role: 'user',
      content: 'Say hello in exactly 5 words.',
    },
  ]

  const completion = await client.complete(messages)

  // Verify response structure
  assertEquals(typeof completion.message.content, 'string')
  assertEquals(completion.message.role, 'assistant')
  assertEquals(typeof completion.usage.promptTokens, 'number')
  assertEquals(typeof completion.usage.completionTokens, 'number')
  assertEquals(typeof completion.usage.totalTokens, 'number')
})

Deno.test('module e2e - createLLMClient with invalid provider', () => {
  const provider = 'invalid' as ModelProvider
  const config: LLMConfig = {
    apiKey: 'dummy-key',
    maxTokens: 100,
  }

  assertRejects(
    async () => {
      const client = createLLMClient(provider, config)
      await client.complete([{ role: 'user', content: 'test' }])
    },
    LLMError,
    'Unknown provider',
  )
})

Deno.test('module e2e - createLLMClient with invalid API key', async () => {
  const provider: ModelProvider = 'claude'
  const config: LLMConfig = {
    apiKey: '',  // Empty API key
  }

  await assertRejects(
    async () => {
      const client = createLLMClient(provider, config);
      await client.complete([{ role: 'user', content: 'test' }]);
    },
    Error,
    'API key is required'
  )
}) 