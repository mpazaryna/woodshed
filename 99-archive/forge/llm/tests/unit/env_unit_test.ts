import { assertEquals, assertThrows } from 'https://deno.land/std@0.208.0/assert/mod.ts'
import { getRequiredEnvVar, getEnvVar } from '@forge/llm'

// Pure unit tests - testing just the env utilities in isolation
Deno.test('unit: getRequiredEnvVar', async (t) => {
  await t.step('returns value when set', () => {
    Deno.env.set('TEST_VAR', 'test-value')
    assertEquals(getRequiredEnvVar('TEST_VAR'), 'test-value')
    Deno.env.delete('TEST_VAR')
  })

  await t.step('throws when not set', () => {
    assertThrows(
      () => getRequiredEnvVar('MISSING_VAR'),
      Error,
      'Required environment variable MISSING_VAR is not set'
    )
  })
})

Deno.test('unit: getEnvVar', async (t) => {
  await t.step('returns value when set', () => {
    Deno.env.set('TEST_VAR', 'test-value')
    assertEquals(getEnvVar('TEST_VAR', 'default'), 'test-value')
    Deno.env.delete('TEST_VAR')
  })

  await t.step('returns default when not set', () => {
    assertEquals(getEnvVar('MISSING_VAR', 'default'), 'default')
  })
}) 