import type { RetryOptions } from './types.ts';

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    onError,
    onRetry
  } = options;

  let lastError: Error | unknown;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (onError) {
        if (error instanceof Error) {
          onError(error, attempt);
        } else {
          onError(new Error(String(error)), attempt);
        }
      }

      if (attempt < maxAttempts) {
        if (onRetry) {
          onRetry(attempt, delayMs);
        }
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error(String(lastError));
}; 