import type { CompletionParams } from "../shared/interfaces/provider.ts";
import { createGroqProvider } from "../providers/groq.ts";

export interface MixtralConfig {
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
  baseUrl?: string;
}

export interface MixtralClient {
  complete: (prompt: string) => Promise<string>;
  streamComplete: (prompt: string) => AsyncIterableIterator<string>;
}

export function createMixtralClient(config: MixtralConfig): MixtralClient {
  const modelId = "mixtral-8x7b-32768";
  const provider = createGroqProvider({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  });

  async function complete(prompt: string): Promise<string> {
    const params: CompletionParams = {
      prompt,
      model: modelId,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 1000,
    };

    const response = await provider.complete(params);
    return response.text;
  }

  async function* streamComplete(prompt: string): AsyncIterableIterator<string> {
    const params: CompletionParams = {
      prompt,
      model: modelId,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 1000,
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