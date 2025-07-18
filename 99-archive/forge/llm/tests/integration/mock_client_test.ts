import {
  assertEquals,
  assertRejects,
} from 'https://deno.land/std@0.208.0/assert/mod.ts'
import { createMockClient } from '@forge/llm'

Deno.test('mock client - returns configured response', async () => {
  const mockResponse = 'Hello, this is a test response'
  const client = createMockClient({
    apiKey: 'test-key',
    mockResponses: [{ message: mockResponse }],
  })

  const result = await client.complete([
    { role: 'user', content: 'Hello' },
  ])

  assertEquals(result.message.content, mockResponse)
  assertEquals(result.message.role, 'assistant')
})

Deno.test('mock client - handles multiple responses in sequence', async () => {
  const responses = ['First response', 'Second response']
  const client = createMockClient({
    apiKey: 'test-key',
    mockResponses: responses.map(message => ({ message })),
  })

  const result1 = await client.complete([
    { role: 'user', content: 'First' },
  ])
  const result2 = await client.complete([
    { role: 'user', content: 'Second' },
  ])

  assertEquals(result1.message.content, responses[0])
  assertEquals(result2.message.content, responses[1])
})

Deno.test('mock client - calculates token usage', async () => {
  const client = createMockClient({
    apiKey: 'test-key',
    mockResponses: [{
      message: 'Test',
      tokens: { prompt: 10, completion: 20 },
    }],
  })

  const result = await client.complete([
    { role: 'user', content: 'Hello' },
  ])

  assertEquals(result.usage.promptTokens, 10)
  assertEquals(result.usage.completionTokens, 20)
  assertEquals(result.usage.totalTokens, 30)
})

Deno.test('mock client - handles errors', async () => {
  const client = createMockClient({
    apiKey: 'test-key',
    shouldFail: true,
  })

  await assertRejects(
    () => client.complete([{ role: 'user', content: 'Hello' }]),
    Error,
    'Mock client error',
  )
}) 