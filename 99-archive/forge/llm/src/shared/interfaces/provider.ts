export interface CompletionParams {
  prompt: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface CompletionResponse {
  text: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface CompletionChunk {
  text: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface Provider {
  id: string;
  config: unknown;

  // Core functionality
  complete(params: CompletionParams): Promise<CompletionResponse>;
  streamComplete(params: CompletionParams): AsyncIterableIterator<CompletionChunk>;

  // Provider management
  initialize(config: unknown): Promise<void>;
  validateConfig(config: unknown): void;
  handleRateLimiting(): Promise<void>;
} 