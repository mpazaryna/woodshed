import { assertEquals, assertExists } from 'https://deno.land/std@0.208.0/assert/mod.ts'
import { createLLMClient } from '@forge/llm'
import { logger, type LogEvent } from '@forge/llm'

// Mock fetch for integration tests
function mockFetch(status: number, response?: unknown): void {
  globalThis.fetch = () => {
    const res = new Response(JSON.stringify(response), { status })
    // Don't throw error here, let the client handle it
    return Promise.resolve(res)
  }
}

// Store original fetch and console methods
const originalFetch = globalThis.fetch
const originalConsole = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
}

// Store original env
const originalEnv = globalThis.Deno?.env.get

// Reset state between test steps
function resetState() {
  // Reset logger state
  logger.clearHandlers()
  logger.setConsoleLogging(false)
  
  // Reset fetch mock
  globalThis.fetch = originalFetch
  
  // Reset console methods
  console.debug = originalConsole.debug
  console.info = originalConsole.info
  console.warn = originalConsole.warn
  console.error = originalConsole.error

  // Reset env
  if (globalThis.Deno) {
    Deno.env.get = originalEnv
  }
}

Deno.test('integration: logger with LLM clients', async (t) => {
  await t.step('captures Claude API interactions', async () => {
    resetState()
    
    // Set debug level for logging
    if (globalThis.Deno) {
      Deno.env.get = (key: string) => key === "LLM_LOG_LEVEL" ? "debug" : undefined
    }
    
    // Collect log events
    const events: LogEvent[] = []
    logger.addHandler((event) => events.push(event))

    // Mock successful API response
    mockFetch(200, {
      content: [{ text: 'test response', type: 'text' }],
      role: 'assistant',
      usage: {
        input_tokens: 10,
        output_tokens: 5,
      },
    })

    const client = createLLMClient('claude', {
      apiKey: 'test-key',
      model: 'claude-3-sonnet-20240229',
    })

    await client.complete([
      { role: 'user', content: 'test' },
    ])

    // Verify client creation log
    const creationLog = events.find(e => 
      e.level === 'info' && 
      e.message.includes('Creating Claude client')
    )
    assertExists(creationLog, 'Client creation log should exist')
    assertEquals(creationLog?.metadata?.model, 'claude-3-sonnet-20240229')

    // Verify API request log
    const requestLog = events.find(e => 
      e.level === 'debug' && 
      e.message.includes('Sending request to Claude API')
    )
    assertExists(requestLog, 'API request log should exist')
    assertEquals(requestLog?.metadata?.model, 'claude-3-sonnet-20240229')

    // Verify API response log
    const responseLog = events.find(e =>
      e.level === 'debug' &&
      e.message.includes('Received response from Claude API')
    )
    assertExists(responseLog, 'API response log should exist')
    assertEquals(responseLog?.metadata?.inputTokens, 10)
    assertEquals(responseLog?.metadata?.outputTokens, 5)
  })

  await t.step('captures API errors', async () => {
    resetState()
    
    // Set debug level for logging
    if (globalThis.Deno) {
      Deno.env.get = (key: string) => key === "LLM_LOG_LEVEL" ? "debug" : undefined
    }
    
    // Collect log events
    const events: LogEvent[] = []
    logger.addHandler((event) => events.push(event))

    // Mock API error
    mockFetch(429, {
      error: {
        type: 'rate_limit_error',
        message: 'Rate limit exceeded',
      },
    })

    const client = createLLMClient('claude', {
      apiKey: 'test-key',
    })

    await client.complete([
      { role: 'user', content: 'test' },
    ]).catch(() => {
      // Expected error, ignore
    })

    // Verify error log
    const errorLog = events.find(e =>
      e.level === 'error' &&
      e.message.includes('Claude API error')
    )
    assertExists(errorLog, 'Error log should exist')
    assertEquals(errorLog?.metadata?.status, 429)
    const errorData = errorLog?.metadata?.error as { message?: string }
    assertEquals(errorData?.message, 'Rate limit exceeded')
  })

  // Final cleanup
  resetState()
}) 