import { assertEquals, assertExists } from "std/assert/mod.ts"
import { createLLMClient } from "@forge/llm"
import type { LogEvent } from "@forge/llm"
import { logger } from "@forge/llm"

/**
 * Example custom log handler that formats logs for a hypothetical logging service
 */
interface LoggingServiceEvent {
  timestamp: string
  level: string
  component: string
  message: string
  metadata?: Record<string, unknown>
}

class ExampleLoggingService {
  private events: LoggingServiceEvent[] = []

  log(event: LoggingServiceEvent): void {
    this.events.push(event)
    // In real usage, you might send this to a logging service
    console.log(
      `[${event.timestamp}] ${event.level.toUpperCase()} [${event.component}] ${event.message}`,
      event.metadata || ""
    )
  }

  getEvents(): LoggingServiceEvent[] {
    return this.events
  }

  clear(): void {
    this.events = []
  }
}

Deno.test("e2e: logging system demonstration", async (t) => {
  // Skip if no API key available
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY")
  if (!apiKey) {
    console.log("Skipping E2E logging test - no API key available")
    return
  }

  // Create a shared logging service for all tests
  const loggingService = new ExampleLoggingService()

  await t.step("demonstrates successful API interaction logs", async () => {
    // 1. Configure logger with custom handler
    logger.clearHandlers()
    logger.setConsoleLogging(false)

    // Set debug level for logging
    const originalEnv = Deno.env.get
    Deno.env.get = (key: string) => key === "LLM_LOG_LEVEL" ? "debug" : originalEnv(key)

    logger.addHandler((event: LogEvent) => {
      loggingService.log({
        timestamp: event.timestamp,
        level: event.level,
        component: "llm-module",
        message: event.message,
        metadata: event.metadata,
      })
    })

    // 2. Create LLM client - this will generate logs
    const client = createLLMClient("claude", {
      apiKey,
      model: "claude-3-sonnet-20240229",
    })

    // 3. Make an API call
    const _completion = await client.complete([
      { role: "user", content: "Say hello!" },
    ])

    // 4. Verify logs were captured
    const logs = loggingService.getEvents()

    // Should have client creation log
    const creationLog = logs.find(
      (e) => e.level === "info" && e.message.includes("Creating Claude client")
    )
    assertExists(creationLog, "Client creation log should exist")
    if (creationLog) {
      assertEquals(creationLog.component, "llm-module")
      assertEquals(creationLog.metadata?.model, "claude-3-sonnet-20240229")
    }

    // Should have API request log
    const requestLog = logs.find(
      (e) => e.level === "debug" && e.message.includes("Sending request to Claude API")
    )
    assertExists(requestLog, "API request log should exist")
    if (requestLog) {
      assertEquals(requestLog.component, "llm-module")
    }

    // Should have API response log
    const responseLog = logs.find(
      (e) => e.level === "debug" && e.message.includes("Received response from Claude API")
    )
    assertExists(responseLog, "API response log should exist")
    if (responseLog) {
      assertEquals(responseLog.component, "llm-module")
      assertExists(responseLog.metadata?.inputTokens, "Should track input tokens")
      assertExists(responseLog.metadata?.outputTokens, "Should track output tokens")
    }

    // Restore env and clear logs for next test
    Deno.env.get = originalEnv
    loggingService.clear()
  })

  await t.step("demonstrates error logging", async () => {
    // Mock invalid API key to trigger error
    const client = createLLMClient("claude", {
      apiKey: "invalid-key",
      model: "claude-3-sonnet-20240229",
    })

    try {
      await client.complete([
        { role: "user", content: "This should fail due to invalid API key" },
      ])
    } catch (_error) {
      // Expected error
    }

    const logs = loggingService.getEvents()

    // Should have error log
    const errorLog = logs.find(
      (e) => e.level === "error" && e.message.includes("Claude API error")
    )
    assertExists(errorLog, "Error log should exist")
    if (errorLog) {
      assertEquals(errorLog.component, "llm-module")
      assertExists(errorLog.metadata?.error, "Should include error details")
      assertExists(errorLog.metadata?.status, "Should include HTTP status")
      assertEquals(errorLog.metadata?.status, 401)
    }

    // Clear logs for next test
    loggingService.clear()
  })

  await t.step("demonstrates log level filtering", async () => {
    // Configure logger
    logger.clearHandlers()
    logger.setConsoleLogging(false)
    logger.addHandler((event: LogEvent) => {
      loggingService.log({
        timestamp: event.timestamp,
        level: event.level,
        component: "llm-module",
        message: event.message,
        metadata: event.metadata,
      })
    })

    // Set log level to info (won't show debug logs)
    const originalEnv = Deno.env.get
    Deno.env.get = (key: string) => key === "LLM_LOG_LEVEL" ? "info" : originalEnv(key)

    // Create client and make request
    const client = createLLMClient("claude", {
      apiKey,
      model: "claude-3-sonnet-20240229",
    })

    await client.complete([
      { role: "user", content: "Quick test" },
    ])

    const logs = loggingService.getEvents()

    // Should only see info and higher logs
    assertEquals(
      logs.every((log) => log.level !== "debug"),
      true,
      "Should not see debug logs when level is set to info"
    )

    // Restore env
    Deno.env.get = originalEnv
  })

  // Cleanup
  logger.clearHandlers()
  logger.setConsoleLogging(true)
}) 