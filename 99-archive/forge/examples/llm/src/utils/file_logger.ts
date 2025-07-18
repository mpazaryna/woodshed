import { ensureDirSync } from "https://deno.land/std@0.208.0/fs/ensure_dir.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import type { LogEvent } from "llm/mod.ts";

// Ensure logs directory exists
const LOGS_DIR = "./logs";
ensureDirSync(LOGS_DIR);

/**
 * Creates a log file handler that writes logs to a file
 * @param filename The name of the log file
 * @returns A log handler function
 */
export function createFileLogger(filename: string) {
  const logPath = join(LOGS_DIR, filename);
  const encoder = new TextEncoder();

  // Open file in append mode
  const file = Deno.openSync(logPath, {
    write: true,
    append: true,
    create: true,
  });

  return function fileLogHandler(event: LogEvent) {
    const metadata = event.metadata 
      ? ` | metadata: ${JSON.stringify(event.metadata)}`
      : '';
      
    const logLine = `[${event.timestamp}] ${event.level.toUpperCase()}: ${event.message}${metadata}\n`;
    
    // Write to file
    file.writeSync(encoder.encode(logLine));
  };
}

/**
 * Creates a rotating file logger that creates a new log file each day
 * @returns A log handler function that writes to daily rotating files
 */
export function createDailyRotatingFileLogger() {
  let currentDate = new Date().toISOString().split('T')[0];
  let currentHandler: (event: LogEvent) => void;

  // Initialize the first handler
  currentHandler = createFileLogger(`${currentDate}.log`);

  return function rotatingLogHandler(event: LogEvent) {
    const logDate = new Date().toISOString().split('T')[0];
    
    // If date has changed, create new handler
    if (logDate !== currentDate) {
      currentDate = logDate;
      currentHandler = createFileLogger(`${currentDate}.log`);
    }
    
    currentHandler(event);
  };
} 