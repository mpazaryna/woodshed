/// <reference lib="deno.ns" />

// Logging levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// Log event structure
export interface LogEvent {
  level: LogLevel
  message: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// Handler type for log events
export type LogHandler = (event: LogEvent) => void

// Default log level if not set
const DEFAULT_LOG_LEVEL: LogLevel = 'info'

// Log level hierarchy for filtering
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Environment variable to control logging
const LOG_LEVEL_ENV = 'LLM_LOG_LEVEL'

/**
 * Logger class that supports custom handlers
 */
class Logger {
  private handlers: Set<LogHandler> = new Set()
  private consoleEnabled = true

  /**
   * Add a custom handler for log events
   */
  addHandler(handler: LogHandler): void {
    this.handlers.add(handler)
  }

  /**
   * Remove a custom handler
   */
  removeHandler(handler: LogHandler): void {
    this.handlers.delete(handler)
  }

  /**
   * Enable or disable console logging
   */
  setConsoleLogging(enabled: boolean): void {
    this.consoleEnabled = enabled
  }

  /**
   * Clear all custom handlers
   */
  clearHandlers(): void {
    this.handlers.clear()
  }

  /**
   * Get current log level from environment or default
   */
  private getLogLevel(): LogLevel {
    const envLevel = Deno.env.get(LOG_LEVEL_ENV)?.toLowerCase() as LogLevel
    return envLevel && LOG_LEVELS[envLevel] !== undefined ? envLevel : DEFAULT_LOG_LEVEL
  }

  /**
   * Check if a log level should be displayed based on current settings
   */
  private shouldLog(level: LogLevel): boolean {
    const currentLevel = this.getLogLevel()
    return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel]
  }

  /**
   * Format and emit a log event
   */
  private emit(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return

    const event: LogEvent = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    }

    // Notify custom handlers
    this.handlers.forEach(handler => {
      try {
        handler(event)
      } catch (error) {
        console.error('Error in log handler:', error)
      }
    })

    // Console logging if enabled
    if (this.consoleEnabled) {
      const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
      const formattedMessage = `[${event.timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`

      switch (level) {
        case 'debug':
          console.debug(formattedMessage)
          break
        case 'info':
          console.info(formattedMessage)
          break
        case 'warn':
          console.warn(formattedMessage)
          break
        case 'error':
          console.error(formattedMessage)
          break
      }
    }
  }

  // Public logging methods
  debug(message: string, metadata?: Record<string, unknown>): void {
    this.emit('debug', message, metadata)
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.emit('info', message, metadata)
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.emit('warn', message, metadata)
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this.emit('error', message, metadata)
  }
}

// Export singleton instance
export const logger: Logger = new Logger() 