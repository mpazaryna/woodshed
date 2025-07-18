// recipe_insights_test.ts

import { assertEquals, assertExists } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { generateInsights } from "./recipe_insights.ts";

Deno.test("generateInsights - returns at least 3 insights", async () => {
  const recipes = "Sample recipe data including pasta dishes, grilled meats, and vegetarian salads.";
  const insights = await generateInsights(recipes);

  assertExists(insights);
  assertEquals(Object.keys(insights).length >= 3, true);
  assertExists(insights.insight_1);
  assertExists(insights.insight_2);
  assertExists(insights.insight_3);
});

Deno.test("generateInsights - handles up to 5 insights correctly", async () => {
  const recipes = "Extensive recipe data covering various cuisines, including Italian, Mexican, Chinese, and Indian dishes, with a mix of vegetarian and meat-based options.";
  const insights = await generateInsights(recipes);

  assertExists(insights);
  assertEquals(Object.keys(insights).length >= 3, true);
  assertEquals(Object.keys(insights).length <= 5, true);
  
  for (let i = 1; i <= Object.keys(insights).length; i++) {
    assertExists(insights[`insight_${i}`]);
  }
});

Deno.test("generateInsights - handles empty input", async () => {
  const recipes = "";
  const insights = await generateInsights(recipes);

  assertExists(insights);
  assertEquals(Object.keys(insights).length >= 3, true);
});

Deno.test("generateInsights - handles long input", async () => {
  const recipes = "A very long and detailed description of numerous recipes, including ingredients, cooking methods, and cuisine types...".repeat(50);
  const insights = await generateInsights(recipes);

  assertExists(insights);
  assertEquals(Object.keys(insights).length >= 3, true);
  assertEquals(Object.keys(insights).length <= 5, true);
});