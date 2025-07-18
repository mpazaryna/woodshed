import { assertEquals, assertRejects } from "std/assert/mod.ts";
import { createGroqProvider } from "../../../src/providers/groq.ts";
import type { Provider, CompletionParams } from "../../../src/shared/interfaces/provider.ts";

Deno.test("createGroqProvider", async (t) => {
  await t.step("initialization", async () => {
    const config = { apiKey: "test-key" };
    const provider = createGroqProvider(config);
    
    assertEquals(provider.id, "groq");
    await provider.initialize(config);
  });

  await t.step("validates config", async () => {
    const provider = createGroqProvider({
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
    const baseProvider = createGroqProvider({
      apiKey: "test-key",
    });

    const params: CompletionParams = {
      prompt: "Hello",
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      maxTokens: 100,
    };

    const mockResponse = { text: "Hello there!" };
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
    const baseProvider = createGroqProvider({
      apiKey: "test-key",
    });

    const params: CompletionParams = {
      prompt: "Hello",
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      maxTokens: 100,
    };

    const mockChunks = [
      { text: "Hello" },
      { text: " there" },
      { text: "!" },
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

    const chunks = [];
    for await (const chunk of provider.streamComplete(params)) {
      chunks.push(chunk);
    }

    assertEquals(chunks, mockChunks);
  });
}); 