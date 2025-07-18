// storage.ts
import { ArticleMetadata } from "./types.ts";

export const ensureOutputDir = async (dir: string): Promise<void> => {
  try {
    await Deno.mkdir(dir, { recursive: true });
  } catch (error) {
    // Ignore error if directory already exists
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }
};

export const sanitizeFilename = (filename: string): string =>
  filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim()
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);

export const createYamlFrontmatter = (metadata: ArticleMetadata): string =>
  Object.entries(metadata)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

export const buildArticleContent = (
  metadata: ArticleMetadata,
  content: string
): string => `---\n${createYamlFrontmatter(metadata)}\n---\n\n${content}`;

export const saveArticle = async (
  metadata: ArticleMetadata,
  content: string,
  outputDir: string
): Promise<{ fileName: string; filePath: string }> => {
  await ensureOutputDir(outputDir);

  const fileName = `${sanitizeFilename(metadata.title)}.md`;
  const filePath = `${outputDir}/${fileName}`;

  const fileContent = buildArticleContent(metadata, content);
  await Deno.writeTextFile(filePath, fileContent);

  return { fileName, filePath };
};

export const readArticle = async (filePath: string): Promise<string> => {
  try {
    return await Deno.readTextFile(filePath);
  } catch (error) {
    throw new Error(`Failed to read article at ${filePath}: ${error.message}`);
  }
};

export const listArticles = async (outputDir: string): Promise<string[]> => {
  try {
    await ensureOutputDir(outputDir); // Ensure directory exists before listing
    const files: string[] = [];
    for await (const entry of Deno.readDir(outputDir)) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        files.push(entry.name);
      }
    }
    return files;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return []; // Return empty array if directory doesn't exist
    }
    throw new Error(
      `Failed to list articles in ${outputDir}: ${error.message}`
    );
  }
};

export const deleteArticle = async (filePath: string): Promise<void> => {
  try {
    await Deno.remove(filePath);
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw new Error(
        `Failed to delete article at ${filePath}: ${error.message}`
      );
    }
  }
};
