import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts'
import { spy } from 'https://deno.land/std@0.208.0/testing/mock.ts'
import { logger, type LogEvent } from '@forge/llm'

// Store original console methods
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
  logger.setConsoleLogging(true)
  
  // Restore original console methods
  console.debug = originalConsole.debug
  console.info = originalConsole.info
  console.warn = originalConsole.warn
  console.error = originalConsole.error
  
  // Reset env mock
  if (globalThis.Deno) {
    Deno.env.get = originalEnv
  }
}

Deno.test('unit: logger', async (t) => {
  await t.step('log level filtering', async (t) => {
    await t.step('respects debug level', () => {
      resetState()
      
      // Set debug level
      if (globalThis.Deno) {
        Deno.env.get = (key: string) => key === 'LLM_LOG_LEVEL' ? 'debug' : undefined
      }
      
      const events: LogEvent[] = []
      logger.addHandler((event) => events.push(event))
      
      logger.debug('test debug')
      logger.info('test info')
      logger.warn('test warn')
      logger.error('test error')
      
      assertEquals(events.length, 4)
      assertEquals(events.map(e => e.level), ['debug', 'info', 'warn', 'error'])
    })

    await t.step('respects info level', () => {
      resetState()
      
      // Set info level
      if (globalThis.Deno) {
        Deno.env.get = (key: string) => key === 'LLM_LOG_LEVEL' ? 'info' : undefined
      }
      
      const events: LogEvent[] = []
      logger.addHandler((event) => events.push(event))
      
      logger.debug('test debug')
      logger.info('test info')
      logger.warn('test warn')
      logger.error('test error')
      
      assertEquals(events.length, 3)
      assertEquals(events.map(e => e.level), ['info', 'warn', 'error'])
    })

    await t.step('respects warn level', () => {
      resetState()
      
      // Set warn level
      if (globalThis.Deno) {
        Deno.env.get = (key: string) => key === 'LLM_LOG_LEVEL' ? 'warn' : undefined
      }
      
      const events: LogEvent[] = []
      logger.addHandler((event) => events.push(event))
      
      logger.debug('test debug')
      logger.info('test info')
      logger.warn('test warn')
      logger.error('test error')
      
      assertEquals(events.length, 2)
      assertEquals(events.map(e => e.level), ['warn', 'error'])
    })

    await t.step('respects error level', () => {
      resetState()
      
      // Set error level
      if (globalThis.Deno) {
        Deno.env.get = (key: string) => key === 'LLM_LOG_LEVEL' ? 'error' : undefined
      }
      
      const events: LogEvent[] = []
      logger.addHandler((event) => events.push(event))
      
      logger.debug('test debug')
      logger.info('test info')
      logger.warn('test warn')
      logger.error('test error')
      
      assertEquals(events.length, 1)
      assertEquals(events.map(e => e.level), ['error'])
    })
  })

  await t.step('custom handlers', async (t) => {
    await t.step('handles multiple handlers', () => {
      resetState()
      
      const events: LogEvent[] = []
      const handler1 = (event: LogEvent) => events.push(event)
      const handler2 = (event: LogEvent) => events.push(event)
      
      logger.addHandler(handler1)
      logger.addHandler(handler2)
      logger.info('test message')
      
      assertEquals(events.length, 2)
      assertEquals(events[0].message, 'test message')
      assertEquals(events[1].message, 'test message')
    })

    await t.step('handles handler removal', () => {
      resetState()
      
      const events: LogEvent[] = []
      const handler = (event: LogEvent) => events.push(event)
      
      logger.addHandler(handler)
      logger.info('first message')
      logger.removeHandler(handler)
      logger.info('second message')
      
      assertEquals(events.length, 1)
      assertEquals(events[0].message, 'first message')
    })

    await t.step('handles handler errors', () => {
      resetState()
      
      const errorSpy = spy(console, 'error')
      const handler = () => {
        throw new Error('Handler error')
      }
      
      logger.addHandler(handler)
      logger.info('test message')
      
      assertEquals(errorSpy.calls.length, 1)
      assertEquals(errorSpy.calls[0].args[0].includes('Error in log handler:'), true)
    })
  })

  await t.step('console logging control', async (t) => {
    await t.step('can disable console logging', () => {
      resetState()
      
      const infoSpy = spy(console, 'info')
      logger.setConsoleLogging(false)
      logger.info('test message')
      assertEquals(infoSpy.calls.length, 0)
    })

    await t.step('handlers work when console disabled', () => {
      resetState()
      
      const events: LogEvent[] = []
      const handler = (event: LogEvent) => events.push(event)
      const infoSpy = spy(console, 'info')
      
      logger.setConsoleLogging(false)
      logger.addHandler(handler)
      logger.info('test message')
      
      assertEquals(infoSpy.calls.length, 0)
      assertEquals(events.length, 1)
      assertEquals(events[0].message, 'test message')
    })
  })

  await t.step('metadata handling', () => {
    resetState()
    
    const events: LogEvent[] = []
    const handler = (event: LogEvent) => events.push(event)
    
    logger.addHandler(handler)
    logger.info('test message', { key: 'value' })
    
    assertEquals(events.length, 1)
    assertEquals(events[0].message, 'test message')
    assertEquals(events[0].metadata?.key, 'value')
  })

  // Final cleanup
  resetState()
}) 