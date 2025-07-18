import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { ensureDirSync } from "https://deno.land/std@0.217.0/fs/ensure_dir.ts";

export async function readFile(filePath: string): Promise<string> {
  try {
    return await Deno.readTextFile(filePath);
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error);
    throw error;
  }
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    await Deno.writeTextFile(filePath, content);
    console.log(`File written to ${filePath}`);
  } catch (error) {
    console.error(`Error writing file at ${filePath}:`, error);
    throw error;
  }
}

export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await ensureDir(dirPath);
  } catch (error) {
    console.error(`Error ensuring directory at ${dirPath}:`, error);
    throw error;
  }
}

export function getEnvVariable(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`${key} environment variable is not set`);
  }
  return value;
}

/**
 * Logs a message to both console and file
 * @param message The message to log
 * @param logFile Optional specific log file path (defaults to 'app.log')
 */
export async function log(message: string, logFile = "app.log") {
  console.log(message);
  
  // Ensure logs directory exists
  ensureDirSync("./logs");
  
  // Append to log file with timestamp
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  await Deno.writeTextFile(`./logs/${logFile}`, logMessage, { append: true });
} 