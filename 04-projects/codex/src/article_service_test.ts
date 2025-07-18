import { createArticleService } from "./article_service.ts";
import { ErrorTypes } from "./errors.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test("articleService - invalid URL", async () => {
  const service = createArticleService({
    outputDir: "./test_articles",
    cookies: "",
  });

  const result = await service.fetchArticle("invalid-url");

  assertEquals(result.ok, false);
  if (!result.ok) {
    assertEquals(result.error.type, ErrorTypes.VALIDATION);
  }
});

Deno.test("articleService - valid URL", async () => {
  const service = createArticleService({
    outputDir: "./test_articles",
    cookies: Deno.env.get("MEDIUM_COOKIE") ?? "",
  });

  const result = await service.fetchArticle(
    "https://medium.com/macoclock/10-mac-apps-under-20-that-are-totally-worth-it-0da24b9e665c"
  );

  if (!result.ok) {
    throw new Error(`Article fetch failed: ${result.error.message}`);
  }

  assertEquals(typeof result.value.fileName, "string");
  assertEquals(typeof result.value.filePath, "string");
  assertEquals(typeof result.value.metadata.title, "string");
});
