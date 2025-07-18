/**
 * Supported Claude models
 */
export type ClaudeModel = 
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307'
  | 'claude-2.1'
  | 'claude-2.0'

/**
 * Supported Gemini models
 */
export type GeminiModel = 
  | 'gemini-pro'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'

/**
 * Union type of all supported models
 */
export type SupportedModel = ClaudeModel | GeminiModel

/**
 * Supported LLM model providers
 */
export type ModelProvider = 'claude' | 'gemini' | 'openai'

/**
 * Role of the participant in a chat conversation
 */
export type Role = 'user' | 'assistant' | 'system'

/**
 * A single message in a chat conversation
 */
export interface Message {
  role: Role
  content: string
}

/**
 * Token usage information
 */
export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

/**
 * The response from an LLM completion request
 */
export interface Completion {
  message: Message
  usage: TokenUsage
}

/**
 * A chunk of a streaming response
 */
export interface CompletionChunk {
  message: {
    role: Role
    content: string
  }
  // Note: Some providers may not provide token usage per chunk
  usage?: Partial<TokenUsage>
}

/**
 * Configuration options for creating an LLM client
 */
export interface LLMConfig {
  apiKey: string
  model?: string
  maxTokens?: number
  temperature?: number
  stream?: boolean  // Enable/disable streaming mode
}

/**
 * Error thrown by LLM operations
 */
export class LLMError extends Error {
  constructor(
    message: string,
    public provider: ModelProvider,
    public statusCode?: number,
  ) {
    super(message)
    this.name = 'LLMError'
  }
}

/**
 * Core interface that all LLM clients must implement
 */
export interface LLMClient {
  /**
   * Send a chat completion request to the LLM
   */
  complete(messages: Message[]): Promise<Completion>

  /**
   * Send a streaming chat completion request to the LLM
   * Returns an async iterable that yields completion chunks
   */
  completeStream(messages: Message[]): AsyncIterableIterator<CompletionChunk>
}

/**
 * Factory function signature for creating LLM clients
 */
export type CreateLLMClient = (
  provider: ModelProvider,
  config: LLMConfig,
) => LLMClient 