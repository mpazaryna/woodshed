import { assertEquals, assertExists, assertRejects, assert } from "https://deno.land/std/assert/mod.ts";
import { createOpenRouterClient } from "@forge/llm";

// Skip tests if OPENROUTER_API_KEY is not set
const apiKey = Deno.env.get("OPENROUTER_API_KEY");
const isEnabled = apiKey !== undefined;

Deno.test({
  name: "OpenRouter Integration",
  ignore: !isEnabled,
  sanitizeOps: false,
  sanitizeResources: false,
  async fn(t) {
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is required for this test");
    }

    await t.step("basic completion with GPT-4", async () => {
      const client = createOpenRouterClient({
        apiKey,
        model: "openai/gpt-4",
        temperature: 0,
        maxTokens: 100,
      });

      const prompt = "What is the capital of France?";
      const response = await client.complete(prompt);
      
      assertExists(response);
      assertEquals(typeof response, "string");
      assert(response.length > 0, "Response should not be empty");
    });

    await t.step("streaming completion with GPT-3.5", async () => {
      const client = createOpenRouterClient({
        apiKey,
        model: "openai/gpt-3.5-turbo",
        temperature: 0,
        maxTokens: 100,
      });

      const prompt = "Count from 1 to 3";
      const chunks: string[] = [];
      
      for await (const chunk of client.streamComplete(prompt)) {
        assertExists(chunk);
        assertEquals(typeof chunk, "string");
        chunks.push(chunk);
      }

      assert(chunks.length > 0, "Should receive at least one chunk");
      const fullResponse = chunks.join("");
      assert(fullResponse.length > 0, "Combined response should not be empty");
    });

    await t.step("model switching", async () => {
      const client = createOpenRouterClient({
        apiKey,
        model: "openai/gpt-3.5-turbo",
        temperature: 0,
        maxTokens: 100,
      });

      assertEquals(client.getModel(), "openai/gpt-3.5-turbo");

      const gpt4Client = client.updateConfig({
        model: "openai/gpt-4",
      });

      assertEquals(gpt4Client.getModel(), "openai/gpt-4");
      
      const response = await gpt4Client.complete("Say hello");
      assertExists(response);
      assertEquals(typeof response, "string");
      assert(response.length > 0, "Response should not be empty");
    });

    await t.step("completion with temperature and topP", async () => {
      const client = createOpenRouterClient({
        apiKey,
        model: "openai/gpt-3.5-turbo",
        temperature: 0.1, // More deterministic
        maxTokens: 10, // Short response
        topP: 0.95,
      });

      const prompt = "Write one word: hello";
      const response = await client.complete(prompt);
      
      assertExists(response);
      assertEquals(typeof response, "string");
      assert(response.length > 0, "Response should not be empty");
    });

    await t.step("error handling - invalid API key", async () => {
      const client = createOpenRouterClient({
        apiKey: "invalid",
        model: "openai/gpt-3.5-turbo",
      });

      await assertRejects(
        async () => {
          await client.complete("test");
        },
        Error,
        "OpenRouter API error"
      );
    });
  },
}); 