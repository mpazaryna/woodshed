import { assertEquals } from "std/assert/mod.ts";
import { join, dirname, fromFileUrl } from "std/path/mod.ts";
import { createGenerator } from "@forge/generator";
import { createOpenAIClient } from "@forge/llm";
import { writeTestOutput } from "../test_utils.ts";
import { applyContext } from "@forge/generator";

Deno.test({
  name: "end-to-end content generation",
  ignore: !Deno.env.get("OPENROUTER_API_KEY"),
  async fn(t) {
    await t.step("generates content from template", async () => {
      const llm = createOpenAIClient({
        apiKey: Deno.env.get("OPENROUTER_API_KEY") || "",
        model: "gpt-3.5-turbo"
      });

      const generator = createGenerator({ llm });
      const templatePath = join(dirname(fromFileUrl(import.meta.url)), "../fixtures/templates/basic.md");
      
      const withTemplate = await generator.loadTemplate(templatePath);
      const result = await withTemplate
        .withContext({
          name: "E2E Test",
          type: "test",
          attribute: "generated"
        })
        .generate();

      const template = await Deno.readTextFile(templatePath);
      const processedPrompt = applyContext(template, {
        name: "E2E Test",
        type: "test",
        attribute: "generated"
      });

      // Write test outputs
      await writeTestOutput(
        "basic_template",
        template,
        processedPrompt,
        result.content
      );

      assertEquals(typeof result.content, "string");
      assertEquals(typeof result.metadata.generatedAt, "object");
    });
  }
}); 