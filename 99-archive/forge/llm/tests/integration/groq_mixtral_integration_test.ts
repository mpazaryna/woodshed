import { assertEquals, assertExists, assertRejects, assert } from "std/assert/mod.ts";
import { createMixtralClient } from "@forge/llm";

// Skip tests if GROQ_API_KEY is not set
const apiKey = Deno.env.get("GROQ_API_KEY");
const isEnabled = apiKey !== undefined;

Deno.test({
  name: "Groq Mixtral Integration",
  ignore: !isEnabled,
  sanitizeOps: false,
  sanitizeResources: false,
  async fn(t) {
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is required for this test");
    }

    await t.step("basic completion", async () => {
      const client = createMixtralClient({
        apiKey,
        temperature: 0,
        maxTokens: 100,
      });

      const prompt = "What is the capital of France?";
      const response = await client.complete(prompt);
      
      assertExists(response);
      assertEquals(typeof response, "string");
      assert(response.length > 0, "Response should not be empty");
    });

    await t.step("streaming completion", async () => {
      const client = createMixtralClient({
        apiKey,
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

    await t.step("completion with temperature", async () => {
      const client = createMixtralClient({
        apiKey,
        temperature: 0.1, // More deterministic
        maxTokens: 10, // Short response
      });

      const prompt = "Write one word: hello";
      const response = await client.complete(prompt);
      
      assertExists(response);
      assertEquals(typeof response, "string");
      assert(response.length > 0, "Response should not be empty");
    });

    await t.step("error handling - invalid API key", async () => {
      const client = createMixtralClient({
        apiKey: "invalid",
      });

      await assertRejects(
        async () => {
          await client.complete("test");
        },
        Error,
        "Groq API error"
      );
    });
  },
}); 