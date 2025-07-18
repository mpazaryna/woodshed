import { assertEquals} from "std/assert/mod.ts";
import { join, dirname, fromFileUrl } from "std/path/mod.ts";
import { createGenerator } from "@forge/generator";
import { mockGeneratorConfig } from "@forge/generator";
import { assertIsError } from "../test_utils.ts";

const FIXTURES_DIR = join(dirname(fromFileUrl(import.meta.url)), "../fixtures");

// Reuse template setup
const setupTestTemplate = async () => {
  const templatePath = join(FIXTURES_DIR, "templates/basic.md");
  await Deno.mkdir(dirname(templatePath), { recursive: true });
  await Deno.writeTextFile(templatePath, `# Basic Template Test

Hello {name}!

This is a {type} template with {attribute} content.`);
  return templatePath;
};

Deno.test("generator creation and configuration", async (t) => {
  const templatePath = await setupTestTemplate();

  await t.step("creates generator with valid config", () => {
    const generator = createGenerator(mockGeneratorConfig);
    assertEquals(typeof generator.loadTemplate, "function");
    assertEquals(typeof generator.withContext, "function");
    assertEquals(typeof generator.generate, "function");
  });

  await t.step("generates content with template and context", async () => {
    const generator = createGenerator(mockGeneratorConfig);
    const withTemplate = await generator.loadTemplate(templatePath);
    const result = await withTemplate
      .withContext({
        name: "Test",
        type: "sample",
        attribute: "mock"
      })
      .generate();

    assertEquals(typeof result.content, "string");
    assertEquals(typeof result.metadata.generatedAt, "object");
  });

  await t.step("throws error when template not loaded", async () => {
    const generator = createGenerator(mockGeneratorConfig);
    try {
      await generator.generate();
      throw new Error("Should have thrown");
    } catch (error) {
      assertIsError(error);
      assertEquals(error.message, "Template not loaded");
    }
  });

  await t.step("throws error when context not provided", async () => {
    const generator = createGenerator(mockGeneratorConfig);
    const withTemplate = await generator.loadTemplate(templatePath);
    try {
      await withTemplate.generate();
      throw new Error("Should have thrown");
    } catch (error) {
      assertIsError(error);
      assertEquals(error.message, "Context not provided");
    }
  });
}); 