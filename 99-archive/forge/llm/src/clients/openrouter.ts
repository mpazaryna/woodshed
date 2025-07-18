import type { Provider, CompletionParams } from "../shared/interfaces/provider.ts";
import { createOpenRouterProvider } from "../providers/openrouter.ts";

export type OpenRouterModel = 
  | "openai/gpt-3.5-turbo"
  | "openai/gpt-4"
  | "anthropic/claude-3-opus"
  | "anthropic/claude-3-sonnet"
  | "google/gemini-pro"
  | "meta-llama/llama-2-70b-chat"
  | "mistral/mistral-7b"
  | string; // Allow custom model strings for future compatibility

export interface OpenRouterConfig {
  apiKey: string;
  model: OpenRouterModel;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  baseUrl?: string;
}

export interface OpenRouterClient {
  complete: (prompt: string) => Promise<string>;
  streamComplete: (prompt: string) => AsyncIterableIterator<string>;
  getModel: () => OpenRouterModel;
  updateConfig: (newConfig: Partial<OpenRouterConfig>) => OpenRouterClient;
}

const DEFAULT_CONFIG = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.95,
};

export function createOpenRouterClient(config: OpenRouterConfig): OpenRouterClient {
  const provider: Provider = createOpenRouterProvider({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  });

  const currentConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  async function complete(prompt: string): Promise<string> {
    const params: CompletionParams = {
      prompt,
      model: currentConfig.model,
      temperature: currentConfig.temperature,
      maxTokens: currentConfig.maxTokens,
      topP: currentConfig.topP,
    };

    const response = await provider.complete(params);
    return response.text;
  }

  async function* streamComplete(prompt: string): AsyncIterableIterator<string> {
    const params: CompletionParams = {
      prompt,
      model: currentConfig.model,
      temperature: currentConfig.temperature,
      maxTokens: currentConfig.maxTokens,
      topP: currentConfig.topP,
    };

    for await (const chunk of provider.streamComplete(params)) {
      yield chunk.text;
    }
  }

  function getModel(): OpenRouterModel {
    return currentConfig.model;
  }

  function updateConfig(newConfig: Partial<OpenRouterConfig>): OpenRouterClient {
    return createOpenRouterClient({
      ...currentConfig,
      ...newConfig,
    });
  }

  return {
    complete,
    streamComplete,
    getModel,
    updateConfig,
  };
} 