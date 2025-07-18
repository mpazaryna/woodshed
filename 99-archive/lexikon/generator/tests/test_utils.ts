import { join, dirname, fromFileUrl } from "std/path/mod.ts";
import { ensureDir } from "std/fs/mod.ts";

// Type assertion utilities for tests
export function assertIsError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw new Error('Expected error to be instance of Error');
  }
}

// Mock types that match the implementation but with stricter type safety
export interface MockGeneratorConfig {
  llm: {
    complete: (messages: Array<{ role: string; content: string }>) => Promise<{
      message: { content: string };
    }>;
  };
  retryOptions?: {
    maxAttempts: number;
    delayMs: number;
    // Match implementation's error handling signature
    onError: (error: Error, attempt: number) => void;
    onRetry: (attempt: number, delay: number) => void;
  };
  transforms?: Array<(content: string) => string>;
}

// Utility for handling unknown errors
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// New logging utilities
export async function writeTestOutput(
  testName: string, 
  rawTemplate: string,
  processedPrompt: string,
  response: string
) {
  const testDir = dirname(fromFileUrl(import.meta.url));
  const tmpDir = join(testDir, "tmp");
  
  console.log(`Creating tmp directory at: ${tmpDir}`);
  await ensureDir(tmpDir);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const baseFilename = `${testName}_${timestamp}`;
  
  // Write raw template, processed prompt and response
  const templatePath = join(tmpDir, `${baseFilename}_template.txt`);
  const promptPath = join(tmpDir, `${baseFilename}_prompt.txt`);
  const responsePath = join(tmpDir, `${baseFilename}_response.txt`);
  
  await Deno.writeTextFile(templatePath, rawTemplate);
  await Deno.writeTextFile(promptPath, processedPrompt);
  await Deno.writeTextFile(responsePath, response);
  
  console.log(`Wrote template to: ${templatePath}`);
  console.log(`Wrote processed prompt to: ${promptPath}`);
  console.log(`Wrote response to: ${responsePath}`);
} 