import { assertEquals, assertRejects } from "std/assert/mod.ts";
import { join, dirname, fromFileUrl } from "std/path/mod.ts";
import { loadTemplate, applyContext } from "@forge/generator";

const FIXTURES_DIR = join(dirname(fromFileUrl(import.meta.url)), "../fixtures");

// Create test template file before running tests
const setupTestTemplate = async () => {
  const templatePath = join(FIXTURES_DIR, "templates/basic.md");
  await Deno.mkdir(dirname(templatePath), { recursive: true });
  await Deno.writeTextFile(templatePath, `# Basic Template Test

Hello {name}!

This is a {type} template with {attribute} content.`);
  return templatePath;
};

Deno.test("template loading and context application", async (t) => {
  const templatePath = await setupTestTemplate();

  await t.step("loadTemplate loads and parses template file", async () => {
    const template = await loadTemplate(templatePath);
    assertEquals(
      template.includes("Hello {name}!"), 
      true, 
      "Template should contain variable placeholder"
    );
  });

  await t.step("loadTemplate throws on missing file", async () => {
    await assertRejects(
      () => loadTemplate("nonexistent.md"),
      Error,
      "Failed to load template"
    );
  });

  await t.step("applyContext correctly replaces simple variables", () => {
    const template = "Hello {name}!";
    const context = { name: "World" };
    const result = applyContext(template, context);
    assertEquals(result, "Hello World!");
  });

  await t.step("applyContext preserves unmatched variables", () => {
    const template = "Hello {name}! {missing}";
    const context = { name: "World" };
    const result = applyContext(template, context);
    assertEquals(result, "Hello World! {missing}");
  });
}); 