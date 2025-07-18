import type { Provider } from "./provider.ts";

export interface BaseClient {
  complete(prompt: string): Promise<string>;
  streamComplete(prompt: string): AsyncIterableIterator<string>;
  setProvider(provider: Provider): void;
} 