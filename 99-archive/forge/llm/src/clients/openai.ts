/**
 * @module OpenAIClient
 * 
 * This module provides functionality to interact with the OpenAI API.
 * It allows the creation of an OpenAI client that can send messages and receive completions
 * or streaming responses from the OpenAI models. The client validates the model configuration
 * and handles errors gracefully, logging relevant information for debugging.
 * 
 * @example
 * const client = createOpenAIClient({
 *   apiKey: 'your-api-key',
 *   model: 'gpt-3.5-turbo',
 *   maxTokens: 150,
 *   temperature: 0.7,
 * });
 * 
 * const response = await client.complete([{ role: 'user', content: 'Hello!' }]);
 * console.log(response.message.content);
 */

import { 
  type LLMClient, 
  type Message, 
  type Completion, 
  type CompletionChunk,
  type LLMConfig, 
  LLMError 
} from '../types.ts'
import { logger } from '../utils/log.ts'

export type OpenAIModel = 
  | 'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4-turbo'
  | string;

/**
 * A set of supported OpenAI models.
 * @constant {Set<OpenAIModel>}
 */
const SUPPORTED_OPENAI_MODELS: Set<OpenAIModel> = new Set([
  'gpt-3.5-turbo',
  'gpt-4',
  'gpt-4-turbo'
]);

/**
 * The default OpenAI model to use if none is specified.
 * @constant {OpenAIModel}
 */
const DEFAULT_OPENAI_MODEL: OpenAIModel = 'gpt-3.5-turbo';

/**
 * Represents a message sent to or received from OpenAI.
 * @interface OpenAIMessage
 * @property {string} role - The role of the message sender (e.g., 'user', 'assistant').
 * @property {string} content - The content of the message.
 */
interface OpenAIMessage {
  role: string;
  content: string;
}

/**
 * Represents the response structure from OpenAI's completion API.
 * @interface OpenAIResponse
 * @property {Array<{ message: { content: string } }>} choices - The choices returned by the API.
 * @property {Object} usage - Token usage information.
 * @property {number} usage.prompt_tokens - Number of tokens used in the prompt.
 * @property {number} usage.completion_tokens - Number of tokens used in the completion.
 * @property {number} usage.total_tokens - Total number of tokens used.
 */
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Represents a chunk of streamed response from OpenAI.
 * @interface OpenAIStreamChunk
 * @property {Array<{ delta: { content?: string } }>} choices - The choices returned by the API.
 * @property {Object} [usage] - Token usage information.
 */
interface OpenAIStreamChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Creates an OpenAI client with the specified configuration.
 * @function createOpenAIClient
 * @param {LLMConfig} config - The configuration for the OpenAI client.
 * @returns {LLMClient} The created OpenAI client.
 * @throws {LLMError} Throws an error if the provided model is unsupported.
 */
export function createOpenAIClient(config: LLMConfig): LLMClient {
  // Validate model if provided
  if (config.model && !SUPPORTED_OPENAI_MODELS.has(config.model as OpenAIModel)) {
    const error = `Unsupported OpenAI model: ${config.model}. Supported models are: ${Array.from(SUPPORTED_OPENAI_MODELS).join(', ')}`;
    logger.error(error, { model: config.model });
    throw new LLMError(error, 'openai');
  }

  const model = config.model || DEFAULT_OPENAI_MODEL;
  logger.info('Creating OpenAI client', { model, maxTokens: config.maxTokens });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
    'HTTP-Referer': 'https://github.com/cursor-ai',
    'X-Title': 'Cursor AI Module'
  };

  return {
    /**
     * Sends a completion request to the OpenAI API.
     * @function complete
     * @param {Message[]} messages - An array of messages to send to the API.
     * @returns {Promise<Completion>} The completion response from the API.
     * @throws {LLMError} Throws an error if the API request fails.
     */
    async complete(messages: Message[]): Promise<Completion> {
      try {
        logger.debug('Sending request to OpenAI API', {
          model,
          messageCount: messages.length,
          maxTokens: config.maxTokens,
          temperature: config.temperature,
        });

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model,
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            max_tokens: config.maxTokens || 1024,
            temperature: config.temperature ?? 0.7,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = `OpenAI API error: ${response.statusText}${
            errorData.error?.message ? ` - ${errorData.error.message}` : ''
          }`;
          logger.error(error, { 
            status: response.status,
            statusText: response.statusText,
            error: errorData.error
          });
          throw new LLMError(error, 'openai', response.status);
        }

        const data = await response.json() as OpenAIResponse;

        logger.debug('Received response from OpenAI API', {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        });

        return {
          message: {
            role: 'assistant',
            content: data.choices[0].message.content,
          },
          usage: {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          },
        };
      } catch (error: unknown) {
        if (error instanceof LLMError) {
          throw error;
        }
        
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'An unknown error occurred';
        
        logger.error(`Unexpected error: ${errorMessage}`, {
          error: error instanceof Error ? error.stack : undefined,
        });
          
        throw new LLMError(
          `Unexpected error: ${errorMessage}`,
          'openai',
        );
      }
    },

    /**
     * Sends a streaming completion request to the OpenAI API.
     * @function completeStream
     * @param {Message[]} messages - An array of messages to send to the API.
     * @returns {AsyncIterableIterator<CompletionChunk>} An async iterable of completion chunks.
     * @throws {LLMError} Throws an error if the API request fails.
     */
    async *completeStream(messages: Message[]): AsyncIterableIterator<CompletionChunk> {
      try {
        logger.debug('Sending streaming request to OpenAI API', {
          model,
          messageCount: messages.length,
          maxTokens: config.maxTokens,
          temperature: config.temperature,
        });

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model,
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            max_tokens: config.maxTokens || 1024,
            temperature: config.temperature ?? 0.7,
            stream: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = `OpenAI API error: ${response.statusText}${
            errorData.error?.message ? ` - ${errorData.error.message}` : ''
          }`;
          logger.error(error, { 
            status: response.status,
            statusText: response.statusText,
            error: errorData.error
          });
          throw new LLMError(error, 'openai', response.status);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new LLMError('No response body available', 'openai');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            // Process all complete lines
            for (let i = 0; i < lines.length - 1; i++) {
              const line = lines[i].trim();
              if (!line || !line.startsWith('data: ')) continue;
              
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data) as OpenAIStreamChunk;
                if (parsed.choices?.[0]?.delta?.content) {
                  yield {
                    message: {
                      role: 'assistant',
                      content: parsed.choices[0].delta.content,
                    },
                    ...(parsed.usage && {
                      usage: {
                        promptTokens: parsed.usage.prompt_tokens,
                        completionTokens: parsed.usage.completion_tokens,
                        totalTokens: parsed.usage.total_tokens,
                      },
                    }),
                  };
                }
              } catch (_e) {
                // Skip invalid JSON
                logger.debug('Skipping invalid JSON in stream', { line });
              }
            }
            
            // Keep the last partial line in the buffer
            buffer = lines[lines.length - 1];
          }
        } finally {
          reader.releaseLock();
        }
      } catch (error: unknown) {
        if (error instanceof LLMError) {
          throw error;
        }
        
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'An unknown error occurred';
        
        logger.error(`Unexpected error in stream: ${errorMessage}`, {
          error: error instanceof Error ? error.stack : undefined,
        });
          
        throw new LLMError(
          `Unexpected error in stream: ${errorMessage}`,
          'openai',
        );
      }
    },
  };
} 