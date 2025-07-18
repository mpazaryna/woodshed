import { assertEquals, assertThrows } from 'https://deno.land/std@0.208.0/assert/mod.ts'
import { createLLMClient } from '@forge/llm'
import { LLMError, type ClaudeModel, type GeminiModel } from '@forge/llm'

// Pure unit tests - testing just the factory's decision making
Deno.test('unit: factory provider selection', async (t) => {
  await t.step('throws on unsupported provider', () => {
    assertThrows(
      () => createLLMClient('openai', { apiKey: 'test' }),
      LLMError,
      'Provider openai is not yet implemented'
    )
  })

  await t.step('accepts claude provider', () => {
    const client = createLLMClient('claude', { apiKey: 'test' })
    assertEquals(typeof client.complete, 'function')
  })

  await t.step('accepts gemini provider', () => {
    const client = createLLMClient('gemini', { apiKey: 'test' })
    assertEquals(typeof client.complete, 'function')
  })
})

Deno.test('unit: factory configuration handling', async (t) => {
  const originalKeys = {
    claude: Deno.env.get('ANTHROPIC_API_KEY'),
    gemini: Deno.env.get('GOOGLE_API_KEY'),
  }

  // Remove env vars for this test
  Deno.env.delete('ANTHROPIC_API_KEY')
  Deno.env.delete('GOOGLE_API_KEY')

  await t.step('requires API key when not in env', async (t) => {
    await t.step('for claude', () => {
      assertThrows(
        () => createLLMClient('claude', { apiKey: '' }),
        Error,
        'API key is required'
      )
    })

    await t.step('for gemini', () => {
      assertThrows(
        () => createLLMClient('gemini', { apiKey: '' }),
        Error,
        'API key is required'
      )
    })
  })

  await t.step('accepts valid configuration', async (t) => {
    const baseConfig = {
      apiKey: 'test',
      temperature: 0.7,
      maxTokens: 1000,
    }

    await t.step('for claude', () => {
      const claudeConfig = {
        ...baseConfig,
        model: 'claude-3-sonnet-20240229' as ClaudeModel,
      }
      const client = createLLMClient('claude', claudeConfig)
      assertEquals(typeof client.complete, 'function')
    })

    await t.step('for gemini', () => {
      const geminiConfig = {
        ...baseConfig,
        model: 'gemini-1.5-pro' as GeminiModel,
      }
      const client = createLLMClient('gemini', geminiConfig)
      assertEquals(typeof client.complete, 'function')
    })
  })

  // Restore original env vars if they existed
  for (const [provider, key] of Object.entries(originalKeys)) {
    if (key) {
      Deno.env.set(
        provider === 'claude' ? 'ANTHROPIC_API_KEY' : 'GOOGLE_API_KEY',
        key
      )
    }
  }
}) 