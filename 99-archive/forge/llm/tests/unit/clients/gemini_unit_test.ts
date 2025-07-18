import { assertEquals, assertRejects } from 'https://deno.land/std@0.208.0/assert/mod.ts'
import { createGeminiClient } from '@forge/llm'
import { LLMError } from '@forge/llm'

const mockFetch = (status: number, data: unknown) => {
  return Promise.resolve({
    ok: status === 200,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    text: () => Promise.resolve(''),
    bytes: () => Promise.resolve(new Uint8Array()),
  } as Response);
};

Deno.test('unit: gemini client', async (t) => {
  const originalFetch = globalThis.fetch

  await t.step('successful completion', async () => {
    try {
      globalThis.fetch = () => mockFetch(200, {
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

      const client = createGeminiClient({
        apiKey: 'test-key',
      })

      const result = await client.complete([
        { role: 'user', content: 'test prompt' },
      ])

      assertEquals(result.message.content, 'test response')
      assertEquals(result.message.role, 'assistant')
      assertEquals(result.usage.promptTokens, 10)
      assertEquals(result.usage.completionTokens, 5)
      assertEquals(result.usage.totalTokens, 15)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  await t.step('handles API error', async () => {
    try {
      globalThis.fetch = () => mockFetch(400, {
        error: {
          message: 'Invalid request',
        },
      })

      const client = createGeminiClient({
        apiKey: 'test-key',
      })

      await assertRejects(
        () => client.complete([{ role: 'user', content: 'test' }]),
        LLMError,
        'Gemini API error: Error - Invalid request',
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  await t.step('handles network error', async () => {
    try {
      globalThis.fetch = () => Promise.reject(new Error('Network error'))

      const client = createGeminiClient({
        apiKey: 'test-key',
      })

      await assertRejects(
        () => client.complete([{ role: 'user', content: 'test' }]),
        LLMError,
        'Unexpected error: Network error',
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })
}) 