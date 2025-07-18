import { assertEquals, assertExists, assertStringIncludes } from "https://deno.land/std/testing/asserts.ts";
import { Prompt } from "@forge/prompt";

Deno.test("Prompt module functionality", async (t) => {
  await t.step("should create a prompt with name and content", () => {
    const name = "test-prompt";
    const content = "This is a test prompt";
    const tags = ["test", "example"];
    
    const prompt = new Prompt(name, content, tags);
    
    assertEquals(prompt.toString(), content);
    assertEquals(prompt.getName(), name);
    assertEquals(prompt.getTags(), tags);
  });

  // Note: We'll need more comprehensive tests for save/load
  // when we have the proper directory structure set up

  await t.step("should stack prompts from a directory", async () => {
    const stackedPrompt = await Prompt.stack("aristotle-drama");
    
    // Verify the stacked prompt
    const content = stackedPrompt.toString();
    assertStringIncludes(content, "# aristotle-drama");
    assertStringIncludes(content, "## advanced");
    assertStringIncludes(content, "Peripeteia (reversal) points");
    
    // Verify tags
    assertEquals(stackedPrompt.getTags(), ["stacked", "aristotle-drama"]);
    assertEquals(stackedPrompt.getName(), "aristotle-drama");
  });

  await t.step("should create and read index with metadata", async () => {
    // Create the index
    await Prompt.createIndex();

    // Read the index
    const index = await Prompt.getIndex();

    // Verify meta section
    assertExists(index.meta);
    assertExists(index.meta.create_date);
    assertEquals(index.meta.description, "Index generated from forge/prompt");

    // Verify aristotle-drama directory exists with metadata
    const dir = index.data["aristotle-drama"];
    assertExists(dir);
    assertEquals(dir.name, "Aristotle Drama Framework");
    assertEquals(dir.description, "A comprehensive framework for analyzing and constructing dramatic works based on Aristotelian principles");
    assertEquals(dir.tags, ["drama", "aristotle", "writing", "analysis"]);
    
    // Verify advanced.txt file is indexed with metadata
    const advancedFile = dir.files["advanced"];
    assertExists(advancedFile);
    assertEquals(advancedFile.description, "Advanced dramatic elements including peripeteia, anagnorisis, and catharsis tracking");
    assertEquals(advancedFile.tags, ["advanced", "dramatic-elements", "structure"]);
    assertEquals(advancedFile.path, "aristotle-drama/advanced.txt");
  });
}); 