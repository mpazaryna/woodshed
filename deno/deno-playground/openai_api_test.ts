// Replace assertEquals with assertStrictEquals
import { assertStrictEquals } from "https://deno.land/std/testing/asserts.ts"; // New import
import { callOpenAI } from "./openai_api.ts";

Deno.test("OpenAI API returns correct answer for capital of France", async () => {
  const prompt = "What is the capital of France?";
  const response = await callOpenAI(prompt);
  
  assertStrictEquals( // Updated assertion method
    response.toLowerCase().includes("paris"),
    true,
    `Expected response to include 'Paris', but got: ${response}`
  );
});