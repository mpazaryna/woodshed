import { assertEquals, assertRejects } from "https://deno.land/std/assert/mod.ts";
import { createOpenRouterProvider } from "../../../src/providers/openrouter.ts";
import type { Provider, CompletionParams, CompletionChunk } from "../../../src/shared/interfaces/provider.ts";

Deno.test("createOpenRouterProvider", async (t) => {
  await t.step("initialization", async () => {
    const config = { apiKey: "test-key" };
    const provider = createOpenRouterProvider(config);
    
    assertEquals(provider.id, "openrouter");
    await provider.initialize(config);
  });

  await t.step("validates config", async () => {
    const provider = createOpenRouterProvider({
      apiKey: "test-key",
    });

    await assertRejects(
      async () => {
        await provider.validateConfig({});
      },
      Error,
      "API key is required"
    );
  });

  await t.step("completion", async () => {
    const baseProvider = createOpenRouterProvider({
      apiKey: "test-key",
    });

    const params: CompletionParams = {
      prompt: "Hello",
      model: "openai/gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 100,
    };

    const mockResponse = { text: "Hello there!", usage: { totalTokens: 10 } };
    const provider: Provider = {
      ...baseProvider,
      complete: (p: CompletionParams) => {
        assertEquals(p, params);
        return Promise.resolve(mockResponse);
      },
    };

    const response = await provider.complete(params);
    assertEquals(response, mockResponse);
  });

  await t.step("streaming", async () => {
    const baseProvider = createOpenRouterProvider({
      apiKey: "test-key",
    });

    const params: CompletionParams = {
      prompt: "Hello",
      model: "openai/gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 100,
    };

    const mockChunks: CompletionChunk[] = [
      { text: "Hello", usage: { totalTokens: 2 } },
      { text: " there", usage: { totalTokens: 4 } },
      { text: "!", usage: { totalTokens: 5 } },
    ];

    const provider: Provider = {
      ...baseProvider,
      streamComplete: async function* (p: CompletionParams) {
        assertEquals(p, params);
        for (const chunk of mockChunks) {
          yield chunk;
        }
      },
    };

    const chunks: CompletionChunk[] = [];
    for await (const chunk of provider.streamComplete(params)) {
      chunks.push(chunk);
    }

    assertEquals(chunks, mockChunks);
  });
}); 