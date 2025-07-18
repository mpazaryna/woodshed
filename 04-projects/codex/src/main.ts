// main.ts
import { createArticleService } from "./article_service.ts";

const config = {
  outputDir: "../articles",
  cookies: Deno.env.get("MEDIUM_COOKIE") ?? "",
};

if (!config.cookies) {
  console.error("Error: MEDIUM_COOKIE environment variable is not set");
  console.error(
    "Please set it using: export MEDIUM_COOKIE='your-cookie-value'"
  );
  Deno.exit(1);
}

const articleService = createArticleService(config);

if (import.meta.main) {
  const url =
    Deno.args[0] ||
    "https://medium.com/macoclock/10-mac-apps-under-20-that-are-totally-worth-it-0da24b9e665c";

  console.log("Starting article fetch...");
  const result = await articleService.fetchArticle(url);

  if (result.ok) {
    console.log("\nArticle saved successfully!");
    console.log("File:", result.value.filePath);
    console.log("Metadata:", result.value.metadata);
  } else {
    console.error("\nFailed to fetch article:", result.error.message);
    console.error("Error type:", result.error.type);
    Deno.exit(1);
  }
}

// deno run --allow-net --allow-write --allow-read --allow-env src/main.ts
