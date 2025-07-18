import { assertEquals, assertExists, assert } from 'https://deno.land/std/assert/mod.ts'
import { getApiKey } from '../../src/utils/env.ts'
import type { ModelProvider } from '../../src/types.ts'

// Integration tests - testing env utilities with actual environment variables
Deno.test('integration: API keys availability', async (t) => {
  await t.step('Anthropic API key is available', () => {
    const apiKey = getApiKey('claude' as ModelProvider)
    assertExists(apiKey, 'Anthropic API key should be set')
    assertEquals(typeof apiKey, 'string', 'API key should be a string')
    assert(apiKey.length > 0, 'API key should not be empty')
  })

  await t.step('Google API key is available', () => {
    const apiKey = getApiKey('gemini' as ModelProvider)
    assertExists(apiKey, 'Google API key should be set')
    assertEquals(typeof apiKey, 'string', 'API key should be a string')
    assert(apiKey.length > 0, 'API key should not be empty')
  })
}) 