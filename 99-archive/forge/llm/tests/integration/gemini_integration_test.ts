import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { createLLMClient } from '@forge/llm'
import { LLMError } from '@forge/llm'

// Store original fetch
const originalFetch = globalThis.fetch

// Mock fetch for integration tests
function mockFetch(status: number, response?: unknown): void {
  globalThis.fetch = () => {
    const res = new Response(JSON.stringify(response), { status })
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${status}`)
    }
    return Promise.resolve(res)
  }
}

// Integration tests - testing how factory and Gemini client work together
Deno.test('integration: gemini client creation and configuration', async (t) => {
  await t.step('factory creates configured gemini client', async () => {
    // Mock successful response
    mockFetch(200, {
      candidates: [{
        content: {
          parts: [{ text: 'test response' }],
          role: 'model',
        }
      }],
      usageMetadata: {
        promptTokenCount: 10,
        candidatesTokenCount: 5,
      },
    })

    const config = {
      apiKey: 'test-key',
      temperature: 0.7,
      maxTokens: 100,
    }
    const client = createLLMClient('gemini', config)
    
    const result = await client.complete([{ role: 'user', content: 'test' }])
    assertEquals(result.message.role, 'assistant')
    assertEquals(result.message.content, 'test response')
    assertEquals(result.usage.promptTokens, 10)
    assertEquals(result.usage.completionTokens, 5)
    assertEquals(result.usage.totalTokens, 15)
  })
})

Deno.test('integration: error handling between components', async (t) => {
  await t.step('invalid API key error propagates correctly', async () => {
    // Mock unauthorized response
    mockFetch(401)

    const client = createLLMClient('gemini', { apiKey: 'invalid-key' })

    await assertRejects(
      () => client.complete([{ role: 'user', content: 'test' }]),
      LLMError,
      'HTTP error! status: 401'
    )
  })

  await t.step('invalid message format error propagates correctly', async () => {
    // Mock bad request response
    mockFetch(400)

    const client = createLLMClient('gemini', { apiKey: 'test-key' })
    await assertRejects(
      // @ts-ignore - intentionally testing invalid message
      () => client.complete([{ role: 'invalid', content: 'test' }]),
      LLMError
    )
  })
})

Deno.test('integration: message processing pipeline', async (t) => {
  await t.step('processes system messages correctly', async () => {
    // Mock successful response
    mockFetch(200, {
      candidates: [{
        content: {
          parts: [{ text: 'test response' }],
          role: 'model',
        }
      }],
      usageMetadata: {
        promptTokenCount: 10,
        candidatesTokenCount: 5,
      },
    })

    const client = createLLMClient('gemini', { apiKey: 'test-key' })
    const result = await client.complete([
      { role: 'system', content: 'test system' },
      { role: 'user', content: 'test user' }
    ])

    assertEquals(result.message.role, 'assistant')
    assertEquals(result.message.content, 'test response')
    assertEquals(result.usage.promptTokens, 10)
    assertEquals(result.usage.completionTokens, 5)
    assertEquals(result.usage.totalTokens, 15)
  })
})

// Cleanup after all tests
Deno.test({
  name: 'cleanup',
  fn() {
    globalThis.fetch = originalFetch
  },
  sanitizeResources: false,
  sanitizeOps: false,
}) 