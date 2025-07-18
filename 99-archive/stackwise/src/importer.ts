import { parse } from "https://deno.land/std/flags/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { config } from "./config.ts";
import { log } from "./utils.ts";

const IMPORT_DIR = config.directories.import_dir;
const OUTPUT_DIR = config.directories.output_dir;
const TEMPLATE_DIR = config.directories.import_templates;

async function loadConversionTemplate(): Promise<string> {
  const templatePath = join(TEMPLATE_DIR, "rule-conversion.txt");
  return await Deno.readTextFile(templatePath);
}

function formatXml(xml: string): string {
  let formatted = '';
  let indent = '';
  const lines = xml.split(/>\s*</).filter(line => line.trim());
  
  lines.forEach(element => {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(2);
    }
    formatted += indent + '<' + element + '>\n';
    if (!element.match(/^[\w!?]/) || element.match(/^(!\[CDATA\[|\?)/)) {
      indent += '  ';
    }
  });
  
  return formatted.substring(1, formatted.length - 2);
}

function extractRuleMetadata(content: string) {
  const extractValue = (pattern: RegExp): string => {
    const match = content.match(pattern);
    return match ? match[1].trim() : '';
  };

  const id = extractValue(/id:\s*"([^"]+)"/);
  const name = extractValue(/name:\s*"([^"]+)"/);
  const tagsMatch = content.match(/tags:\s*\[([\s\S]*?)\]/);
  const tags = tagsMatch ? tagsMatch[1].match(/"([^"]+)"/g)?.map(t => t.replace(/"/g, '')) : [];
  const authorEmail = extractValue(/authorEmail:\s*"([^"]+)"/);
  const created = extractValue(/created:\s*"([^"]+)"/);
  const lastModified = extractValue(/lastModified:\s*"([^"]+)"/);

  // Extract content between backticks
  const contentMatch = content.match(/content\s*=\s*`([\s\S]*?)`/);
  const ruleContent = contentMatch ? contentMatch[1].trim() : '';

  return {
    id,
    name,
    tags,
    metadata: {
      authorEmail,
      created,
      lastModified
    },
    content: ruleContent
  };
}

async function convertFile(filePath: string, outputDir: string): Promise<void> {
  const content = await Deno.readTextFile(filePath);
  const fileName = filePath.split("/").pop()?.replace(".ts", "") || "";
  
  const ruleData = extractRuleMetadata(content);
  if (!ruleData.id) {
    console.error(`Could not extract rule metadata from ${filePath}`);
    await log(`ERROR: Could not extract rule metadata from ${filePath}`, "importer.log");
    return;
  }
  
  const template = await loadConversionTemplate();
  const promptContent = template
    .replace("{ts_content}", content)
    .replace("{name}", fileName)
    .replace("{id}", ruleData.id)
    .replace("{ruleName}", ruleData.name)
    .replace("{tags}", ruleData.tags.map(tag => `<tag>${tag}</tag>`).join("\n    "))
    .replace("{authorEmail}", ruleData.metadata.authorEmail)
    .replace("{created}", ruleData.metadata.created)
    .replace("{modified}", ruleData.metadata.lastModified);

  console.log(`Converting ${filePath}...`);
  await log(`Converting ${filePath}...`, "importer.log");
  
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") || "",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      messages: [{ role: "user", content: promptContent }]
    })
  });

  const data = await response.json();
  const xmlContent = data.content[0].text.replace(/^```xml\n/, '').replace(/\n```$/, '');
  const prettyXml = formatXml(xmlContent);

  const outputPath = join(outputDir, `${fileName}.xml`);
  await Deno.writeTextFile(outputPath, prettyXml);
  console.log(`Converted ${filePath} to ${outputPath}`);
  await log(`Converted ${filePath} to ${outputPath}`, "importer.log");
}

async function main() {
  const args = parse(Deno.args);
  const inputDir = args._[0] as string || IMPORT_DIR;
  const outputDir = args._[1] as string || OUTPUT_DIR;

  console.log(`Starting TypeScript to XML conversion...`);
  console.log(`Input directory: ${inputDir}`);
  console.log(`Output directory: ${outputDir}`);
  await log(`Starting TypeScript to XML conversion...`, "importer.log");
  await log(`Input directory: ${inputDir}`, "importer.log");
  await log(`Output directory: ${outputDir}`, "importer.log");

  try {
    await ensureDir(outputDir);
    let fileCount = 0;
    let errorCount = 0;

    for await (const entry of Deno.readDir(inputDir)) {
      if (entry.isFile && entry.name.endsWith(".ts")) {
        try {
          await convertFile(join(inputDir, entry.name), outputDir);
          fileCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to convert ${entry.name}:`, error);
          await log(`ERROR: Failed to convert ${entry.name}: ${error}`, "importer.log");
        }
      }
    }

    console.log("\nConversion summary:");
    console.log(`- Files processed: ${fileCount}`);
    console.log(`- Errors encountered: ${errorCount}`);
    console.log(`- Output directory: ${outputDir}`);
    await log("\nConversion summary:", "importer.log");
    await log(`- Files processed: ${fileCount}`, "importer.log");
    await log(`- Errors encountered: ${errorCount}`, "importer.log");
    await log(`- Output directory: ${outputDir}`, "importer.log");
  } catch (error) {
    console.error(`Import process failed:`, error);
    await log(`ERROR: Import process failed: ${error}`, "importer.log");
    throw error;
  }
}

if (import.meta.main) {
  main().catch(async (error) => {
    console.error(`FATAL ERROR:`, error);
    await log(`FATAL ERROR: ${error}`, "importer.log");
    Deno.exit(1);
  });
}