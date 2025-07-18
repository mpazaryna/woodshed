import { assert, assertEquals } from 'std/assert/mod.ts'
import { createLLMClient } from '@forge/llm'
import type { Message, CompletionChunk } from '@forge/llm'


// Simple completion test
Deno.test({
  name: 'e2e: claude simple completion',
  ignore: !Deno.env.get('ANTHROPIC_API_KEY'),
  async fn() {
    const client = createLLMClient('claude', {
      apiKey: Deno.env.get('ANTHROPIC_API_KEY') || '',
      temperature: 0,
      maxTokens: 100,
    })

    const result = await client.complete([
      {
        role: 'user',
        content: 'What is 2+2? Reply with just the number.',
      },
    ])

    assertEquals(result.message.role, 'assistant')
    assert(result.message.content.includes('4'))
    assert(result.usage.totalTokens > 0)
  },
})

// Simple streaming test
Deno.test({
  name: 'e2e: claude simple streaming',
  ignore: !Deno.env.get('ANTHROPIC_API_KEY'),
  async fn() {
    const client = createLLMClient('claude', {
      apiKey: Deno.env.get('ANTHROPIC_API_KEY') || '',
      model: 'claude-3-sonnet-20240229',
      temperature: 0,
      maxTokens: 100,
    })

    const messages: Message[] = [{
      role: 'user',
      content: 'Count from 1 to 3.',
    }]

    const stream = client.completeStream(messages)
    const chunks: CompletionChunk[] = []
    
    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    assert(chunks.length > 0, 'Should receive at least one chunk')
    const finalChunk = chunks[chunks.length - 1]
    assert(finalChunk.message.content.length > 0, 'Final chunk should have content')
  },
}) 