import type { MockGeneratorConfig } from "../test_utils.ts";
import { getErrorMessage } from "../test_utils.ts";

export const mockLLM = {
  complete: (messages: Array<{ role: string; content: string }>) => {
    return Promise.resolve({
      message: {
        content: `Mock response for: ${messages[0].content}`
      }
    });
  }
};

export const mockGeneratorConfig: MockGeneratorConfig = {
  llm: mockLLM,
  retryOptions: {
    maxAttempts: 2,
    delayMs: 100,
    // Type-safe error handlers
    onError: (error: unknown, attempt: number) => {
      // Handle error type assertion in the mock
      console.error(`Mock error handler: ${getErrorMessage(error)} (attempt ${attempt})`);
    },
    onRetry: (attempt: number, delay: number) => {
      console.log(`Mock retry handler: attempt ${attempt}, delay ${delay}ms`);
    }
  }
};

// Add type guard for error handling
export function isError(error: unknown): error is Error {
  return error instanceof Error;
} 