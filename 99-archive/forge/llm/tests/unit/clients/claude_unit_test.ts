import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { createClaudeClient } from '@forge/llm'
import { LLMError, type Message, type CompletionChunk } from '@forge/llm'

// Mock fetch helper
function mockFetch(status: number, responseData: unknown): Promise<Response> {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(responseData),
  } as Response)
}

interface MockStreamChunk {
  type: 'content_block_delta' | 'message_stop'
  delta?: {
    type: string
    text: string
  }
  usage?: {
    input_tokens: number
    output_tokens: number
  }
}

// Mock streaming response helper
function mockStreamingFetch(chunks: MockStreamChunk[]): Promise<Response> {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
        await new Promise(resolve => setTimeout(resolve, 0)) // Simulate async
      }
      controller.close()
    },
  })

  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    body: stream,
  } as Response)
}

// Store original fetch for cleanup
const originalFetch = globalThis.fetch

Deno.test('unit: claude client - regular completion', async (t) => {
  await t.step('successful completion', async () => {
    try {
      globalThis.fetch = () => mockFetch(200, {
        content: [{ text: 'test response', type: 'text' }],
        role: 'assistant',
        usage: {
          input_tokens: 10,
          output_tokens: 5,
        },
      })

      const client = createClaudeClient({
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

      const client = createClaudeClient({
        apiKey: 'test-key',
      })

      await assertRejects(
        () => client.complete([{ role: 'user', content: 'test' }]),
        LLMError,
        'Claude API error: Error - Invalid request',
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  await t.step('handles network error', async () => {
    try {
      globalThis.fetch = () => Promise.reject(new Error('Network error'))

      const client = createClaudeClient({
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

  await t.step('validates model', async () => {
    await assertRejects(
      async () => {
        const client = createClaudeClient({
          apiKey: 'test-key',
          model: 'invalid-model',
        });
        await client.complete([{ role: 'user', content: 'test' }]);
      },
      LLMError,
      'Unsupported Claude model',
    )
  })
})

Deno.test('unit: claude client - streaming', async (t) => {
  await t.step('successful streaming completion', async () => {
    try {
      const streamChunks: MockStreamChunk[] = [
        {
          type: 'content_block_delta',
          delta: { type: 'text', text: 'Hello' },
        },
        {
          type: 'content_block_delta',
          delta: { type: 'text', text: ' world' },
        },
        {
          type: 'message_stop',
          usage: {
            input_tokens: 5,
            output_tokens: 2,
          },
        },
      ]

      globalThis.fetch = () => mockStreamingFetch(streamChunks)

      const client = createClaudeClient({
        apiKey: 'test-key',
      })

      const messages: Message[] = [{ role: 'user', content: 'test prompt' }]
      const stream = client.completeStream(messages)

      // Collect all chunks
      const chunks: CompletionChunk[] = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      // Verify stream chunks
      assertEquals(chunks.length, 3)
      assertEquals(chunks[0].message.content, 'Hello')
      assertEquals(chunks[1].message.content, ' world')
      assertEquals(chunks[2].message.content, 'Hello world')
      assertEquals(chunks[2].usage?.promptTokens, 5)
      assertEquals(chunks[2].usage?.completionTokens, 2)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  await t.step('handles streaming API error', async () => {
    try {
      globalThis.fetch = () => mockFetch(400, {
        error: {
          message: 'Invalid request',
        },
      })

      const client = createClaudeClient({
        apiKey: 'test-key',
      })

      const messages: Message[] = [{ role: 'user', content: 'test prompt' }]
      const stream = client.completeStream(messages)

      await assertRejects(
        async () => {
          for await (const _ of stream) {
            // consume stream
          }
        },
        LLMError,
        'Claude API error: Error - Invalid request',
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  await t.step('handles streaming network error', async () => {
    try {
      globalThis.fetch = () => Promise.reject(new Error('Network error'))

      const client = createClaudeClient({
        apiKey: 'test-key',
      })

      const messages: Message[] = [{ role: 'user', content: 'test prompt' }]
      const stream = client.completeStream(messages)

      await assertRejects(
        async () => {
          for await (const _ of stream) {
            // consume stream
          }
        },
        LLMError,
        'Unexpected error in stream: Network error',
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  await t.step('handles malformed streaming response', async () => {
    try {
      const badChunks: MockStreamChunk[] = [
        {
          type: 'content_block_delta',
          delta: { type: 'text', text: '' }, // Empty text
        },
        {
          type: 'message_stop',
          usage: {
            input_tokens: 0,
            output_tokens: 0,
          },
        },
      ]

      globalThis.fetch = () => mockStreamingFetch(badChunks)

      const client = createClaudeClient({
        apiKey: 'test-key',
      })

      const messages: Message[] = [{ role: 'user', content: 'test prompt' }]
      const stream = client.completeStream(messages)

      // Should handle empty chunks without failing
      const chunks: CompletionChunk[] = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      // We expect only one chunk - the final one with empty content and usage info
      assertEquals(chunks.length, 1)
      assertEquals(chunks[0].message.content, '')
      assertEquals(chunks[0].usage?.promptTokens, 0)
      assertEquals(chunks[0].usage?.completionTokens, 0)
      assertEquals(chunks[0].usage?.totalTokens, 0)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  await t.step('handles system messages in stream', async () => {
    try {
      const streamChunks: MockStreamChunk[] = [
        {
          type: 'content_block_delta',
          delta: { type: 'text', text: 'Response with system context' },
        },
        {
          type: 'message_stop',
          usage: {
            input_tokens: 10,
            output_tokens: 5,
          },
        },
      ]

      globalThis.fetch = () => mockStreamingFetch(streamChunks)

      const client = createClaudeClient({
        apiKey: 'test-key',
      })

      const messages: Message[] = [
        { role: 'system', content: 'system context' },
        { role: 'user', content: 'test prompt' },
      ]
      const stream = client.completeStream(messages)

      const chunks: CompletionChunk[] = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      assertEquals(chunks.length, 2)
      assertEquals(chunks[0].message.content, 'Response with system context')
    } finally {
      globalThis.fetch = originalFetch
    }
  })
}) 