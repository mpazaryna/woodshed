# Module LLM

A Deno module for interacting with various LLM providers (Claude, Gemini) with a unified interface.

## Installation

```ts
import { createLLMClient } from 'llm'
```

## Basic Usage

```ts
import { createLLMClient } from 'llm'

const client = createLLMClient('claude', {
  apiKey: 'your-api-key',
  model: 'claude-3-sonnet-20240229'
})

const completion = await client.complete([
  { role: 'user', content: 'Hello!' }
])

console.log(completion.message.content)
```

## Logging System

The module includes a flexible logging system that can be integrated with your application's logging infrastructure.

### Log Levels

Logs are categorized into four levels:

- `debug`: Detailed information for debugging
- `info`: General information about operations
- `warn`: Warning messages for potential issues
- `error`: Error messages for failures

### Configuring Log Level

Set the log level using the `LLM_LOG_LEVEL` environment variable:

```bash
export LLM_LOG_LEVEL=debug  # Show all logs
export LLM_LOG_LEVEL=info   # Default level
export LLM_LOG_LEVEL=warn   # Show only warnings and errors
export LLM_LOG_LEVEL=error  # Show only errors
```

### Custom Log Handlers

You can integrate the module's logs with your application's logging system by adding custom handlers:

```ts
import { logger, type LogEvent } from 'llm'

// Example: Send logs to a logging service
logger.addHandler((event: LogEvent) => {
  myLoggingService.log({
    level: event.level,
    message: event.message,
    timestamp: event.timestamp,
    ...event.metadata
  })
})

// Example: Collect specific logs
const apiCalls: LogEvent[] = []
logger.addHandler((event: LogEvent) => {
  if (event.message.includes('API')) {
    apiCalls.push(event)
  }
})

// Example: Disable console logging if needed
logger.setConsoleLogging(false)
```

### Log Event Structure

Each log event includes:

```ts
interface LogEvent {
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  timestamp: string
  metadata?: Record<string, unknown>
}
```

### Example Log Output

```ts
// Debug log with metadata
[2024-03-21T10:30:15.123Z] DEBUG: Sending request to Claude API {"model":"claude-3-sonnet","messageCount":1}

// Info log
[2024-03-21T10:30:15.124Z] INFO: Creating Claude client {"model":"claude-3-sonnet"}

// Error log with metadata
[2024-03-21T10:30:16.234Z] ERROR: API call failed {"status":429,"error":"Rate limit exceeded"}
```

## Test Coverage

The module includes comprehensive test coverage reporting capabilities. You can generate coverage reports using the following commands:

```bash
# First, run tests with coverage collection
deno task test:cov

# Then, either:
# Generate LCOV and console coverage reports
deno task test:cov-report

# Or generate an HTML coverage report
deno task test:cov-html
```

The commands will:

1. `test:cov` - Run all tests and collect coverage data in the `coverage` directory
2. `test:cov-report` - Generate both LCOV format (for CI/tooling) and console summary
3. `test:cov-html` - Create an HTML report in the default `coverage` directory

After running the HTML report generation, open the generated HTML file in your browser to view a detailed coverage report with syntax highlighting and line-by-line analysis.

Note: The coverage data shows we currently have:

- High function coverage across the codebase
- Good branch coverage in core components
- Complete line coverage in critical modules like logging and environment utilities
