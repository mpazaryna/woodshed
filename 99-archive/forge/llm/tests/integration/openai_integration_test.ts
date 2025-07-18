import { assertEquals, assertExists, assert } from "https://deno.land/std/assert/mod.ts";
import { createOpenAIClient } from "@forge/llm";
import { type Message, LLMError } from "@forge/llm";

// Skip tests if OPENROUTER_API_KEY is not set
const apiKey = Deno.env.get("OPENROUTER_API_KEY")?.trim();
const isEnabled = apiKey !== undefined;

Deno.test({
  name: "OpenAI Integration",
  ignore: !isEnabled,
  sanitizeOps: false,
  sanitizeResources: false,
  async fn(t) {
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is required for this test");
    }

    await t.step("basic completion with GPT-3.5", async () => {
      const client = createOpenAIClient({
        apiKey,
        model: "gpt-3.5-turbo",
        temperature: 0,
        maxTokens: 100,
      });

      const messages: Message[] = [{
        role: "user",
        content: "What is the capital of France?"
      }];
      
      const response = await client.complete(messages);
      
      assertExists(response.message);
      assertEquals(typeof response.message.content, "string");
      assert(response.message.content.length > 0, "Response should not be empty");
      assertExists(response.usage, "Should include token usage");
    });

    await t.step("streaming completion with GPT-3.5", async () => {
      const client = createOpenAIClient({
        apiKey,
        model: "gpt-3.5-turbo",
        temperature: 0,
        maxTokens: 100,
      });

      const messages: Message[] = [{
        role: "user",
        content: "Count from 1 to 3"
      }];
      
      const chunks: string[] = [];
      
      for await (const chunk of client.completeStream(messages)) {
        assertExists(chunk.message);
        assertEquals(typeof chunk.message.content, "string");
        assert(chunk.message.content.length > 0, "Each chunk should have content");
        chunks.push(chunk.message.content);
      }

      assert(chunks.length > 0, "Should receive at least one chunk");
      const fullResponse = chunks.join("");
      assert(fullResponse.length > 0, "Combined response should not be empty");
      assert(
        /1.*2.*3/.test(fullResponse.replace(/\s+/g, " ")),
        "Response should contain numbers 1, 2, and 3"
      );
    });

    await t.step("handles errors gracefully", async () => {
      const client = createOpenAIClient({
        apiKey: "invalid-key",
        model: "gpt-3.5-turbo",
      });

      try {
        await client.complete([{
          role: "user",
          content: "test"
        }]);
        assert(false, "Should have thrown an error");
      } catch (error) {
        assert(error instanceof LLMError, "Should throw an LLMError");
        assert(error.message.includes("API error"), "Should throw API error");
      }
    });
  },
}); 