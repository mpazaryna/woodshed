import { join, dirname, fromFileUrl } from "@std/path";
import { parse } from "@std/flags";
import { ensureDir } from "@std/fs";
import { createGenerator } from "@lexikon/generator";
import { createOpenAIClient } from "@lexikon/llm";

interface YogaSequence {
  name: string;
  level: string;
  duration: string;
  focus: string;
  style: string;
  props?: string[];
  contraindications?: string[];
  concept: string;
}

interface Config {
  template: string;
  sequences: YogaSequence[];
}

async function loadConfig(configPath: string): Promise<Config> {
  try {
    const content = await Deno.readTextFile(configPath);
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading config from ${configPath}:`, error);
    throw error;
  }
}

function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length: 5 },
    () => chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

async function generateSequence(
  sequence: YogaSequence,
  templatePath: string,
): Promise<string> {
  const llm = createOpenAIClient({
    apiKey: Deno.env.get('OPENROUTER_API_KEY') || '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
  });

  const generator = createGenerator({
    llm,
    retryOptions: {
      maxAttempts: 3,
      delayMs: 1000,
      onError: (error, attempt) => {
        console.error(`❌ Generation attempt ${attempt} failed:`, error.message);
      },
      onRetry: (attempt, delay) => {
        console.log(`🔄 Retrying in ${delay/1000} seconds... (attempt ${attempt})`);
      }
    }
  });

  console.log("Loading template...");
  const withTemplate = await generator.loadTemplate(templatePath);
  
  console.log("Adding context...");
  const withContext = withTemplate.withContext(sequence);
  
  console.log("Generating content...");
  const result = await withContext.generate();

  return result.content;
}

async function main() {
  const flags = parse(Deno.args, {
    string: ["config"],
    default: {
      config: "./data/config/setlist.json"
    },
  });

  const configPath = join(dirname(fromFileUrl(import.meta.url)), 
                         "../", flags.config);
  
  try {
    const config = await loadConfig(configPath);
    const templatePath = join(
      dirname(fromFileUrl(import.meta.url)),
      "../data/template",
      config.template
    );

    const outputDir = join(dirname(fromFileUrl(import.meta.url)), "../data/output");
    await ensureDir(outputDir);

    for (const sequence of config.sequences) {
      console.log(`\nGenerating sequence: ${sequence.name}`);
      console.log("----------------------------------------");

      try {
        const content = await generateSequence(sequence, templatePath);
        const uniqueId = generateShortId();
        
        const outputPath = join(
          outputDir,
          `${uniqueId}-${sequence.name.toLowerCase().replace(/\s+/g, '-')}.md`
        );
        
        await Deno.writeTextFile(outputPath, content);
        console.log(`✅ Sequence saved to: ${outputPath}`);
        console.log(`\nSequence ID: ${uniqueId}`);
      } catch (error) {
        console.error(`❌ Error generating sequence ${sequence.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to run generation:", error);
    console.error("\nUsage:");
    console.error("  deno task start [--config=<path>]");
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
} 