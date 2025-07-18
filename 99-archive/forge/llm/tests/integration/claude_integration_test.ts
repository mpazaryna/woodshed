import {
  assert,
  assertEquals,
  assertExists,
  assertRejects,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { delay } from "https://deno.land/std@0.208.0/async/delay.ts";
import { createLLMClient } from '@forge/llm'
import { LLMError } from '@forge/llm'
import type { Message, CompletionChunk } from '@forge/llm'

// Store original fetch
const originalFetch = globalThis.fetch

// Mock fetch for integration tests
const mockFetch = (status: number, response?: unknown): Promise<Response> => {
  if (status === 200 && response) {
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(response),
    } as Response)
  }

  // Error response
  const errorResponse = {
    error: {
      type: 'authentication_error',
      message: 'invalid x-api-key'
    }
  }

  return Promise.resolve({
    ok: false,
    status,
    statusText: status === 401 ? 'Unauthorized' : 'Error',
    json: () => Promise.resolve(errorResponse),
  } as Response)
}

// Mock streaming response helper
function mockStreamingFetch(chunks: Array<{text: string, isLast?: boolean}> = []): Promise<Response> {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      let accumulatedContent = ''
      
      for (const [index, chunk] of chunks.entries()) {
        const isLast = index === chunks.length - 1 || chunk.isLast
        accumulatedContent += chunk.text
        
        const streamChunk = isLast ? {
          type: 'message_stop',
          usage: {
            input_tokens: 10,
            output_tokens: chunks.reduce((acc, c) => acc + c.text.length, 0),
          }
        } : {
          type: 'content_block_delta',
          delta: {
            type: 'text',
            text: chunk.text
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(streamChunk)}\n\n`))
        
        // If this is the last chunk, send the final message with complete content
        if (isLast) {
          const finalChunk = {
            type: 'content_block_delta',
            delta: {
              type: 'text',
              text: accumulatedContent
            },
            usage: {
              input_tokens: 10,
              output_tokens: accumulatedContent.length,
              total_tokens: 10 + accumulatedContent.length
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`))
        }
        
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
    headers: new Headers({
      'Content-Type': 'text/event-stream',
    }),
  } as Response)
}

// Integration tests - testing how factory and Claude client work together
Deno.test('integration: claude client creation and configuration', async (t) => {
  await t.step('factory creates configured claude client', async () => {
    // Reset mock fetch for this test
    globalThis.fetch = () => mockFetch(200, {
      content: [{ text: 'test response', type: 'text' }],
      role: 'assistant',
      usage: { input_tokens: 10, output_tokens: 20 },
    })

    const config = {
      apiKey: 'test-key',
      model: 'claude-3-sonnet-20240229',
      temperature: 0.5,
    }
    const client = createLLMClient('claude', config)
    
    const result = await client.complete([{ role: 'user', content: 'test' }])
    assertEquals(result.message.role, 'assistant')
    assertEquals(result.message.content, 'test response')
  })
})

Deno.test('integration: error handling between components', async (t) => {
  await t.step('invalid API key error propagates correctly', async () => {
    // Reset mock fetch for this test
    globalThis.fetch = () => mockFetch(401)

    const client = createLLMClient('claude', { apiKey: 'invalid-key' })

    await assertRejects(
      () => client.complete([{ role: 'user', content: 'test' }]),
      LLMError,
      'Claude API error: Unauthorized - invalid x-api-key'
    )
  })

  await t.step('invalid message format error propagates correctly', async () => {
    // Reset mock fetch for this test
    globalThis.fetch = () => mockFetch(400)

    const client = createLLMClient('claude', { apiKey: 'test-key' })
    await assertRejects(
      // @ts-ignore - intentionally testing invalid message
      () => client.complete([{ role: 'invalid', content: 'test' }]),
      LLMError,
      'Claude API error: Error - invalid x-api-key'
    )
  })
})

Deno.test('integration: message processing pipeline', async (t) => {
  await t.step('processes system messages correctly', async () => {
    // Reset mock fetch for this test
    globalThis.fetch = () => mockFetch(200, {
      content: [{ text: 'test response', type: 'text' }],
      role: 'assistant',
      usage: { input_tokens: 10, output_tokens: 20 },
    })

    const client = createLLMClient('claude', { apiKey: 'test-key' })
    const result = await client.complete([
      { role: 'system', content: 'test system' },
      { role: 'user', content: 'test user' }
    ])

    assertEquals(result.message.role, 'assistant')
    assertEquals(result.message.content, 'test response')
  })
})

Deno.test('integration: claude streaming', async (t) => {
  // Skip API key check since we're using mocks
  await t.step('streams response with token usage', async () => {
    // Reset mock fetch for this test
    globalThis.fetch = () => mockStreamingFetch([
      { text: '1' },
      { text: '\n2' },
      { text: '\n3' },
      { text: '\n4' },
      { text: '\n5' },
    ])

    const client = createLLMClient('claude', {
      apiKey: 'test-key',
      model: 'claude-3-sonnet-20240229',
      maxTokens: 100,
      temperature: 0,
    })

    const messages: Message[] = [{
      role: 'user',
      content: 'Count from 1 to 5 slowly.',
    }]

    const stream = client.completeStream(messages)
    const chunks: CompletionChunk[] = []
    
    for await (const chunk of stream) {
      chunks.push(chunk)
      await delay(100) // Add small delay between chunks
    }

    // Verify we got multiple chunks
    assert(chunks.length > 1, 'Should receive multiple chunks')

    // Verify final chunk has complete content and usage info
    const finalChunk = chunks[chunks.length - 1]
    assertExists(finalChunk.usage, 'Final chunk should have usage info')
    assert(finalChunk.usage?.totalTokens && finalChunk.usage.totalTokens > 0, 'Should have token usage')
    assert(
      finalChunk.message.content.includes('5'),
      'Final content should be complete'
    )
  })

  await t.step('handles early stream termination', async () => {
    // Reset mock fetch for this test
    globalThis.fetch = () => mockStreamingFetch(
      Array.from({ length: 10 }, (_, i) => ({ 
        text: `Part ${i + 1} of the story.`,
        isLast: i === 9
      }))
    )

    const client = createLLMClient('claude', {
      apiKey: 'test-key',
      model: 'claude-3-sonnet-20240229',
      maxTokens: 500,
      temperature: 0,
    })

    const messages: Message[] = [{
      role: 'user',
      content: 'Write a very long story about a robot.',
    }]

    const stream = client.completeStream(messages)
    let chunkCount = 0
    
    try {
      for await (const _ of stream) {
        chunkCount++
        if (chunkCount >= 5) {
          break // Early termination
        }
        await delay(100)
      }
    } catch (_error) {
      assert(false, 'Early stream termination should not throw')
    }

    assertEquals(chunkCount, 5, 'Should receive exactly 5 chunks before termination')
  })

  await t.step('handles system messages in stream', async () => {
    // Reset mock fetch for this test
    globalThis.fetch = () => mockStreamingFetch([
      { text: 'BEEP BOOP. ' },
      { text: 'I am a robot assistant. ' },
      { text: 'How may I help you?' },
    ])

    const client = createLLMClient('claude', {
      apiKey: 'test-key',
      model: 'claude-3-sonnet-20240229',
      maxTokens: 100,
      temperature: 0,
    })

    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are a robot who speaks in a very mechanical way.',
      },
      {
        role: 'user',
        content: 'Say hello.',
      },
    ]

    const stream = client.completeStream(messages)
    const chunks: CompletionChunk[] = []
    
    for await (const chunk of stream) {
      chunks.push(chunk)
      await delay(100)
    }

    // Verify system message influenced the response
    const finalChunk = chunks[chunks.length - 1]
    assert(
      finalChunk.message.content.toLowerCase().includes('beep') || 
      finalChunk.message.content.toLowerCase().includes('robot') || 
      finalChunk.message.content.toLowerCase().includes('mechanical'),
      'Response should reflect system message instructions'
    )
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