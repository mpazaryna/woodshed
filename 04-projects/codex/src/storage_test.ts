import { assertEquals } from "jsr:@std/assert";
import { saveArticle } from "./storage.ts";
import { ArticleMetadata } from "./types.ts";

Deno.test(
  "saveArticle should save an article and return file details",
  async () => {
    const metadata: ArticleMetadata = {
      title: "Test Article",
      author: "Test Author",
      source: "Test Source",
      publishDate: new Date().toISOString(),
      dateSaved: new Date().toISOString(),
    };
    const content = "This is a test article.";
    const outputDir = "./test_output"; // Ensure this directory is created before running the test

    const result = await saveArticle(metadata, content, outputDir);

    assertEquals(result.fileName, "test-article.md");
    assertEquals(result.filePath, "./test_output/test-article.md");

    // Clean up: Remove the created file after the test
    await Deno.remove(result.filePath);
  }
);
