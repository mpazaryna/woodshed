import { join, dirname, fromFileUrl } from "@std/path";
import { parse } from "@std/flags";
import { ensureDir } from "@std/fs";
import { createGenerator} from "../generator/generator.ts";
import { createOpenAIClient as llmClient } from "@lexikon/llm";

// Content type discriminator
type ContentType = 'yoga' | 'dharma';

// Domain-specific context types with discriminator
interface BaseContext extends Record<string, unknown> {
  type: ContentType;
  name: string;
  style?: string;
}

interface YogaContext extends BaseContext {
  type: 'yoga';
  level: string;
  duration: string;
  focus: string;
  props?: string[];
  contraindications?: string[];
  concept: string;
}

interface DharmaTalkContext extends BaseContext {
  type: 'dharma';
  focus: string;
  duration?: string;
  targetAudience?: string;
  concept: string;
}

type GenerationContext = YogaContext | DharmaTalkContext;

interface TestConfig {
  provider: string;
  template: string;
  sequences?: YogaContext[];
  talks?: DharmaTalkContext[];
}

// Content type-specific handlers
const contentHandlers: Record<ContentType, {
  validateContext: (context: GenerationContext) => void;
  formatOutput: (content: string, context: GenerationContext) => string;
}> = {
  yoga: {
    validateContext: (context) => {
      if (context.type !== 'yoga') throw new Error('Invalid context type');
      if (!context.level) throw new Error('Level is required for yoga sequences');
      if (!context.duration) throw new Error('Duration is required for yoga sequences');
      if (!context.focus) throw new Error('Focus is required for yoga sequences');
    },
    formatOutput: (content, context) => {
      const yoga = context as YogaContext;
      return [
        "---",
        `id: ${generateShortId()}`,
        `date: ${new Date().toISOString()}`,
        `type: yoga`,
        `name: ${yoga.name}`,
        `level: ${yoga.level}`,
        `duration: ${yoga.duration}`,
        `focus: ${yoga.focus}`,
        yoga.style ? `style: ${yoga.style}` : null,
        yoga.props ? `props: ${JSON.stringify(yoga.props)}` : null,
        yoga.contraindications ? `contraindications: ${JSON.stringify(yoga.contraindications)}` : null,
        "status: draft",
        "---",
        "",
        `# ${yoga.name} - ${yoga.level} Level Yoga Sequence`,
        `Duration: ${yoga.duration}`,
        `Focus: ${yoga.focus}`,
        yoga.props ? `Props: ${yoga.props.join(', ')}` : '',
        '',
        content
      ].filter(Boolean).join('\n');
    }
  },
  dharma: {
    validateContext: (context) => {
      if (context.type !== 'dharma') throw new Error('Invalid context type');
      if (!context.concept) throw new Error('Concept is required for dharma talks');
      if (!context.focus) throw new Error('Focus is required for dharma talks');
    },
    formatOutput: (content, context) => {
      const dharma = context as DharmaTalkContext;
      return [
        "---",
        `id: ${generateShortId()}`,
        `date: ${new Date().toISOString()}`,
        `type: dharma`,
        `name: ${dharma.name}`,
        `focus: ${dharma.focus}`,
        dharma.style ? `style: ${dharma.style}` : null,
        dharma.duration ? `duration: ${dharma.duration}` : null,
        dharma.targetAudience ? `targetAudience: ${dharma.targetAudience}` : null,
        "status: draft",
        "---",
        "",
        `# ${dharma.name} - Dharma Talk`,
        `Focus: ${dharma.focus}`,
        `Concept: ${dharma.concept}`,
        '',
        content
      ].filter(Boolean).join('\n');
    }
  }
};

export async function loadConfig(configPath: string): Promise<TestConfig> {
  try {
    const content = await Deno.readTextFile(configPath);
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading config from ${configPath}:`, error);
    throw error;
  }
}

// Function to generate a 5 character alphanumeric ID
function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length: 5 },
    () => chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

async function generateContent(
  item: GenerationContext,
  config: TestConfig,
): Promise<string> {
  const handler = contentHandlers[item.type];
  handler.validateContext(item);

  const templatePath = join(
    dirname(fromFileUrl(import.meta.url)),
    "../../data/templates",
    config.template
  );

  const llm = llmClient({
    apiKey: Deno.env.get('OPENROUTER_API_KEY')?.trim() || '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
  });

  // Create generator with LLM client
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

  // Break down the steps for debugging
  console.log("Loading template...");
  const withTemplate = await generator.loadTemplate(templatePath);
  console.log("Adding context...");
  const withContext = withTemplate.withContext(item);
  console.log("Generating content...");
  const result = await withContext.generate();

  return handler.formatOutput(result.content, item);
}

export async function generateTestSequence(
  config: TestConfig,
  itemName?: string
): Promise<void> {
  const items = config.sequences 
    ? config.sequences.map(s => ({ ...s, type: 'yoga' as const }))
    : config.talks 
      ? config.talks.map(t => ({ ...t, type: 'dharma' as const }))
      : [];
      
  const selectedItems = itemName
    ? items.filter(s => s.name === itemName)
    : items;

  if (itemName && selectedItems.length === 0) {
    console.error(`No content found with name: ${itemName}`);
    return;
  }

  const outputDir = join(dirname(fromFileUrl(import.meta.url)), "../../data/output");
  await ensureDir(outputDir);

  for (const item of selectedItems) {
    console.log(`\nGenerating ${item.type} content: ${item.name}`);
    console.log("----------------------------------------");

    try {
      const content = await generateContent(item, config);
      const uniqueId = generateShortId();
      
      const outputPath = join(
        outputDir,
        `${uniqueId}-${item.name.toLowerCase().replace(/\s+/g, '-')}-${item.type}-prompt.md`
      );
      
      await Deno.writeTextFile(outputPath, content);
      console.log(`✅ Content saved to: ${outputPath}`);
      console.log(`\nContent ID: ${uniqueId}`);
    } catch (error) {
      console.error(`❌ Error generating ${item.type} content ${item.name}:`, error);
    }
  }
}

if (import.meta.main) {
  const flags = parse(Deno.args, {
    string: ["config", "sequence"],
    default: {
      config: "data/config/dharma-config.json"
    },
  });

  const configPath = join(dirname(fromFileUrl(import.meta.url)), 
                         `../../${flags.config}`);
  
  try {
    const config = await loadConfig(configPath);
    await generateTestSequence(config, flags.sequence);
  } catch (error) {
    console.error("Failed to run test generation:", error);
    console.error("\nUsage:");
    console.error("  deno run --allow-read --allow-write content-strategy.ts [options]");
    console.error("\nOptions:");
    console.error("  --config=<string>    Path to test configuration file (default: data/config/dharma-config.json)");
    console.error("  --sequence=<string>  Name of specific sequence to generate (optional)");
    Deno.exit(1);
  }
} 