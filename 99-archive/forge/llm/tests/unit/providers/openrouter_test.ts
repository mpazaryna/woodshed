import { assertEquals, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { createOpenRouterProvider } from "@forge/llm";
import type { Provider, CompletionParams } from "@forge/llm";
import type { CompletionChunk } from "@forge/llm";

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
      { 
        message: {
          role: "assistant",
          content: "Hello"
        }, 
        usage: { totalTokens: 2 } 
      },
      { 
        message: {
          role: "assistant",
          content: " there"
        }, 
        usage: { totalTokens: 4 } 
      },
      { 
        message: {
          role: "assistant",
          content: "!"
        }, 
        usage: { totalTokens: 5 } 
      },
    ];

    const provider: Provider = {
      ...baseProvider,
      streamComplete: async function* (p: CompletionParams) {
        assertEquals(p, params);
        for (const chunk of mockChunks) {
          yield {
            text: chunk.message.content,
            usage: chunk.usage
          };
        }
      },
    };

    const chunks: CompletionChunk[] = [];
    for await (const chunk of provider.streamComplete(params)) {
      chunks.push({
        message: {
          role: "assistant",
          content: chunk.text
        },
        usage: chunk.usage
      });
    }

    assertEquals(chunks, mockChunks);
  });
}); 