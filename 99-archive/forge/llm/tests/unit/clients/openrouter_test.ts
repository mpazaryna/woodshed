import { assertEquals, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { createOpenRouterClient } from "@forge/llm";

// Mock the OpenRouter provider module
const mockResponse = { text: "Hello from mock!", usage: { totalTokens: 10 } };
const mockStreamChunks = [
  { text: "Hello", usage: { totalTokens: 2 } },
  { text: " from", usage: { totalTokens: 4 } },
  { text: " mock!", usage: { totalTokens: 6 } },
];

// Deno allows us to mock imports directly
const originalFetch = globalThis.fetch;
let shouldFail = false;

function mockFetch(_input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (shouldFail) {
    return Promise.reject(new Error("Network error"));
  }

  if (init?.body) {
    const body = JSON.parse(init.body.toString());
    assertEquals(body.model, "openai/gpt-4"); // Default test model
    
    // For streaming responses
    if (body.stream) {
      const chunks = mockStreamChunks.map(chunk => 
        `data: ${JSON.stringify({ choices: [{ delta: { content: chunk.text } }], usage: chunk.usage })}\n\n`
      );
      chunks.push("data: [DONE]\n\n");
      
      const stream = new ReadableStream({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(new TextEncoder().encode(chunk)));
          controller.close();
        },
      });

      return Promise.resolve(new Response(stream, { status: 200 }));
    }
    
    // For regular responses
    return Promise.resolve(new Response(
      JSON.stringify({ 
        choices: [{ message: { content: mockResponse.text } }],
        usage: mockResponse.usage,
      }),
      { status: 200 }
    ));
  }

  return Promise.reject(new Error("Invalid request"));
}

Deno.test("createOpenRouterClient", async (t) => {
  // Replace fetch with our mock before each test
  globalThis.fetch = mockFetch as typeof globalThis.fetch;

  await t.step("basic completion", async () => {
    shouldFail = false;
    const client = createOpenRouterClient({
      apiKey: "test-key",
      model: "openai/gpt-4",
      temperature: 0,
      maxTokens: 100,
    });

    const response = await client.complete("Hi");
    assertEquals(response, mockResponse.text);
  });

  await t.step("streaming", async () => {
    shouldFail = false;
    const client = createOpenRouterClient({
      apiKey: "test-key",
      model: "openai/gpt-4",
      temperature: 0,
      maxTokens: 100,
    });

    const chunks: string[] = [];
    for await (const chunk of client.streamComplete("Hi")) {
      chunks.push(chunk);
    }

    assertEquals(chunks, mockStreamChunks.map(c => c.text));
  });

  await t.step("respects configuration", async () => {
    shouldFail = false;
    const client = createOpenRouterClient({
      apiKey: "test-key",
      model: "openai/gpt-4",
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.95,
    });

    const response = await client.complete("test");
    assertEquals(response, mockResponse.text);
  });

  await t.step("handles errors", async () => {
    shouldFail = true;
    const client = createOpenRouterClient({
      apiKey: "test-key",
      model: "openai/gpt-4",
    });

    await assertRejects(
      () => client.complete("test"),
      Error,
      "Network error"
    );
  });

  await t.step("model selection", () => {
    const client = createOpenRouterClient({
      apiKey: "test",
      model: "anthropic/claude-3-sonnet"
    });
    
    assertEquals(client.getModel(), "anthropic/claude-3-sonnet");
  });

  await t.step("config updates", async () => {
    shouldFail = false;
    const client = createOpenRouterClient({
      apiKey: "test-key",
      model: "openai/gpt-4",
      temperature: 0.7,
    });

    const updatedClient = client.updateConfig({
      temperature: 0.5,
      maxTokens: 1000,
    });

    const response = await updatedClient.complete("test");
    assertEquals(response, mockResponse.text);
  });

  // Restore original fetch after all tests
  globalThis.fetch = originalFetch;
}); 