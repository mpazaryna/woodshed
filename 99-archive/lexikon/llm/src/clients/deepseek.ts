import type { Provider, CompletionParams } from "../shared/interfaces/provider.ts";
import { createGroqProvider } from "../providers/groq.ts";

export interface DeepSeekConfig {
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  baseUrl?: string;
}

export interface DeepSeekClient {
  complete: (prompt: string) => Promise<string>;
  streamComplete: (prompt: string) => AsyncIterableIterator<string>;
}

export function createDeepSeekClient(config: DeepSeekConfig): DeepSeekClient {
  const modelId = "deepseek-r1-distill-qwen-32b";
  const provider: Provider = createGroqProvider({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  });

  async function complete(prompt: string): Promise<string> {
    const params: CompletionParams = {
      prompt,
      model: modelId,
      temperature: config.temperature ?? 0.6,
      maxTokens: config.maxTokens ?? 4096,
      topP: config.topP ?? 0.95,
    };

    const response = await provider.complete(params);
    return response.text;
  }

  async function* streamComplete(prompt: string): AsyncIterableIterator<string> {
    const params: CompletionParams = {
      prompt,
      model: modelId,
      temperature: config.temperature ?? 0.6,
      maxTokens: config.maxTokens ?? 4096,
      topP: config.topP ?? 0.95,
    };

    for await (const chunk of provider.streamComplete(params)) {
      yield chunk.text;
    }
  }

  return {
    complete,
    streamComplete,
  };
} 