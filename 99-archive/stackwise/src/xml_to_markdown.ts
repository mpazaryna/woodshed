/**
 * @file xml_to_markdown.ts
 * @description Converts XML primitive templates to markdown format
 */

import { DOMParser } from "npm:@xmldom/xmldom";
import { walk } from "https://deno.land/std/fs/mod.ts";

async function convertXmlToMarkdown(xmlContent: string): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, "text/xml");
  if (!doc) throw new Error("Failed to parse XML");

  // Extract metadata
  const name = doc.getElementsByTagName("template")[0]?.getAttribute("name") || "";
  const description = doc.getElementsByTagName("description")[0]?.textContent || "";
  const category = doc.getElementsByTagName("category")[0]?.textContent || "";
  const tags = Array.from(doc.getElementsByTagName("tag") as unknown as ArrayLike<Element>)
    .map(tag => tag.textContent);
  
  // Build front matter
  const frontMatter = [
    "---",
    `name: ${name}`,
    `description: ${description}`,
    `category: ${category}`,
    `tags: ${JSON.stringify(tags)}`,
    "---",
    ""
  ].join("\n");

  // Process principles
  const principles = Array.from(doc.getElementsByTagName("principle") as unknown as ArrayLike<Element>);
  const markdownContent = principles.map(principle => {
    const principleName = principle.getAttribute("name");
    const description = principle.getElementsByTagName("description")[0]?.textContent;
    const steps = Array.from(principle.getElementsByTagName("step") as unknown as ArrayLike<Element>)
      .map(step => `- ${step.textContent}`);
    const errors = Array.from(principle.getElementsByTagName("error") as unknown as ArrayLike<Element>)
      .map(error => `- ${error.textContent}`);

    return `## ${principleName}\n\n${description}\n\n### Steps\n${steps.join("\n")}${errors.length > 0 ? `\n\n### Common Errors\n${errors.join("\n")}` : ''}`;
  }).join("\n\n");

  // Combine everything
  return `${frontMatter}\n# ${name}\n\n${markdownContent}\n`;
}

async function convertFile(inputPath: string) {
  try {
    const xmlContent = await Deno.readTextFile(inputPath);
    const markdownContent = await convertXmlToMarkdown(xmlContent);
    const outputPath = inputPath.replace(".xml", ".md");
    await Deno.writeTextFile(outputPath, markdownContent);
    console.log(`Successfully converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting file ${inputPath}:`, error);
  }
}

async function convertDirectory(inputDir: string) {
  try {
    for await (const entry of walk(inputDir, { exts: [".xml"] })) {
      await convertFile(entry.path);
    }
  } catch (error) {
    console.error("Error converting directory:", error);
  }
}

// Main execution
if (import.meta.main) {
  const args = Deno.args;
  if (args.length < 1) {
    console.error("Usage: deno run --allow-read --allow-write src/xml_to_markdown.ts <input_directory>");
    Deno.exit(1);
  }

  const inputDir = args[0];
  await convertDirectory(inputDir);
}