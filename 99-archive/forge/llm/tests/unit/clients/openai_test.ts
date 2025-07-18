import { assertEquals, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { createOpenAIClient } from "@forge/llm";
import { LLMError } from "@forge/llm";

// Mock response data
const mockResponse = { 
  text: "Hello from mock!", 
  usage: { 
    prompt_tokens: 5,
    completion_tokens: 5,
    total_tokens: 10 
  } 
};
const mockStreamChunks = [
  { text: "Hello", usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } },
  { text: " from", usage: { prompt_tokens: 2, completion_tokens: 2, total_tokens: 4 } },
  { text: " mock!", usage: { prompt_tokens: 3, completion_tokens: 3, total_tokens: 6 } },
];

// Mock fetch for testing
const originalFetch = globalThis.fetch;
let shouldFail = false;

function mockFetch(_input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (shouldFail) {
    return Promise.reject(new Error("Network error"));
  }

  if (init?.body) {
    const body = JSON.parse(init.body.toString());
    
    // For streaming responses
    if (body.stream) {
      const chunks = mockStreamChunks.map(chunk => 
        `data: ${JSON.stringify({ 
          choices: [{ 
            delta: { 
              content: chunk.text 
            } 
          }], 
          usage: chunk.usage 
        })}\n\n`
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
        choices: [{ 
          message: { 
            content: mockResponse.text 
          } 
        }],
        usage: mockResponse.usage,
      }),
      { status: 200 }
    ));
  }

  return Promise.reject(new Error("Invalid request"));
}

Deno.test("createOpenAIClient", async (t) => {
  // Replace fetch with our mock before each test
  globalThis.fetch = mockFetch as typeof globalThis.fetch;

  await t.step("validates model on creation", async () => {
    try {
      createOpenAIClient({
        apiKey: "test-key",
        model: "invalid-model",
      });
      // If we get here, the validation didn't throw as expected
      assertEquals(true, false, "Expected createOpenAIClient to throw for invalid model");
    } catch (error: unknown) {
      assertEquals(error instanceof LLMError, true);
      if (error instanceof LLMError) {
        assertEquals(error.message.includes("Unsupported OpenAI model"), true);
      }
    }
  });

  await t.step("basic completion", async () => {
    shouldFail = false;
    const client = createOpenAIClient({
      apiKey: "test-key",
      model: "gpt-3.5-turbo",
      temperature: 0,
      maxTokens: 100,
    });

    const response = await client.complete([{
      role: "user",
      content: "Hi"
    }]);
    
    assertEquals(response.message.content, mockResponse.text);
    assertEquals(response.usage?.totalTokens, mockResponse.usage.total_tokens);
  });

  await t.step("streaming", async () => {
    shouldFail = false;
    const client = createOpenAIClient({
      apiKey: "test-key",
      model: "gpt-4",
      temperature: 0,
      maxTokens: 100,
    });

    const chunks: string[] = [];
    for await (const chunk of client.completeStream([{
      role: "user",
      content: "Hi"
    }])) {
      chunks.push(chunk.message.content);
    }

    assertEquals(chunks, mockStreamChunks.map(c => c.text));
  });

  await t.step("respects configuration", async () => {
    shouldFail = false;
    const client = createOpenAIClient({
      apiKey: "test-key",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 2048,
    });

    const response = await client.complete([{
      role: "user",
      content: "test"
    }]);
    assertEquals(response.message.content, mockResponse.text);
  });

  await t.step("handles network errors", async () => {
    shouldFail = true;
    const client = createOpenAIClient({
      apiKey: "test-key",
      model: "gpt-3.5-turbo",
    });

    await assertRejects(
      () => client.complete([{
        role: "user",
        content: "test"
      }]),
      LLMError,
      "Network error"
    );
  });

  // Restore original fetch after all tests
  globalThis.fetch = originalFetch;
}); 