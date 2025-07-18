/**
 * @file aic_prompts_markdown.ts
 * @description Generates context-aware artifacts using domain-specific prompts with full primitive inclusion for markdown files
 */

import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { readFile, writeFile, ensureDirectory, getEnvVariable } from "./utils.ts";

// Constants
const DATA_DIR = "data";
const OUTPUT_PATH = join(DATA_DIR, "tmp", "aic.md");
const DOMAIN = "system/compute";
const PROMPT_PATH = join(DATA_DIR, "templates", DOMAIN, "template.txt");

// Types
interface IndexData {
  meta: {
    filename: string;
    version: string;
    generated: string;
    count: number;
    domain: string;
  };
  primitives: Primitive[];
}

interface Primitive {
  name: string;
  description: string;
  category: string;
  tags: string[];
  domain: string;
  path: string;
}

interface AIResponse {
  tags: string[];
  reasoning: string;
  detectedLanguage?: string | null;
}

class AIPromptAnalyzer {
  private availableTags: Set<string>;
  private promptTemplate: string;

  constructor(indexData: IndexData, promptTemplate: string) {
    this.promptTemplate = promptTemplate;
    this.availableTags = new Set(
      indexData.primitives.flatMap(p => p.tags)
    );
    console.log('\nAvailable tags loaded:', Array.from(this.availableTags).sort());
  }

  async analyzeTags(prompt: string): Promise<AIResponse> {
    const apiKey = getEnvVariable("OPENAI_API_KEY");

    const aiPrompt = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: this.promptTemplate
        },
        {
          role: "user",
          content: `User prompt: "${prompt}"`
        }
      ]
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(aiPrompt)
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      console.log('\nLLM Response:', result);
      
      return {
        tags: result.tags,
        reasoning: result.reasoning,
        detectedLanguage: result.detectedLanguage
      };
    } catch (error) {
      console.error('Error calling AI service:', error);
      throw error;
    }
  }
}

class IndexSearcher {
  private index: IndexData;
  private languageSpecificPrimitives: Map<string, Set<string>>;
  private genericPrimitives: Set<string>;

  constructor(indexData: IndexData) {
    this.index = indexData;
    this.languageSpecificPrimitives = new Map();
    this.genericPrimitives = new Set();
    this.categorizePrimitives();
  }

  private categorizePrimitives() {
    console.log('\nCategorizing primitives:');
    for (const primitive of this.index.primitives) {
      const hasLanguageSpecific = primitive.tags.some(tag => tag.endsWith('-specific'));
      
      if (hasLanguageSpecific) {
        const langSpecificTag = primitive.tags.find(tag => tag.endsWith('-specific'));
        if (langSpecificTag) {
          const language = langSpecificTag.replace('-specific', '');
          if (!this.languageSpecificPrimitives.has(language)) {
            this.languageSpecificPrimitives.set(language, new Set());
          }
          this.languageSpecificPrimitives.get(language)?.add(primitive.name);
          console.log(`  Language-specific primitive: ${primitive.name} -> ${language}`);
        }
      } else {
        this.genericPrimitives.add(primitive.name);
        console.log(`  Generic primitive: ${primitive.name}`);
      }
    }
  }

  private isPrimitiveMatching(primitive: Primitive, tags: string[], detectedLanguage: string | null): boolean {
    const hasMatchingTags = primitive.tags.some(tag => tags.includes(tag));
    const isGeneric = this.genericPrimitives.has(primitive.name);

    if (!hasMatchingTags) {
      return false;
    }

    if (isGeneric) {
      return true;
    }

    if (!detectedLanguage) {
      return false;
    }

    const langSpecifics = this.languageSpecificPrimitives.get(detectedLanguage);
    return langSpecifics?.has(primitive.name) || false;
  }

  findMatchingPrimitives(tags: string[], detectedLanguage: string | null): Primitive[] {
    console.log('\nFinding matching primitives:');
    console.log('Input tags:', tags);
    console.log('Detected language:', detectedLanguage);

    const matchedPrimitives = this.index.primitives.filter(primitive => {
      console.log(`\nChecking primitive: ${primitive.name}`);
      console.log(`  Tags: ${primitive.tags.join(', ')}`);

      const isMatching = this.isPrimitiveMatching(primitive, tags, detectedLanguage);
      console.log(`  Result: ${isMatching ? 'Matched' : 'Not matched'}`);
      return isMatching;
    });

    console.log('\nMatched primitives:', matchedPrimitives.map(p => p.name));
    return matchedPrimitives;
  }
}

async function generateMarkdownOutput(matchedPrimitives: Primitive[], aiResult: AIResponse): Promise<string> {
  const sections = await Promise.all(matchedPrimitives.map(async primitive => {
    // Skip if not a markdown file
    if (!primitive.path.endsWith('.md')) {
      return '';
    }
    
    const content = await readFile(primitive.path);
    // Remove frontmatter if present (content between --- markers)
    return content.replace(/^---[\s\S]*?---\n/, '');
  }));

  // Filter out empty strings (from non-markdown files)
  const markdownSections = sections.filter(section => section.length > 0);

  return `# Composition Stack

${markdownSections.join('\n\n')}`;
}

async function main() {
  try {
    const promptTemplate = await readFile(PROMPT_PATH);
    const config = await loadConfig();
    const indexData = await loadIndexData(config.indexPath);

    const analyzer = new AIPromptAnalyzer(indexData, promptTemplate);
    const prompt = await loadUserPrompt();

    const aiResult = await analyzer.analyzeTags(prompt);
    const searcher = new IndexSearcher(indexData);
    const matchedPrimitives = searcher.findMatchingPrimitives(aiResult.tags, aiResult.detectedLanguage);

    const evalContent = generateEvaluationContent(prompt, aiResult, matchedPrimitives);
    await ensureDirectory('data/evals');
    await writeFile('data/evals/aic-compose.txt', evalContent);

    const markdownOutput = await generateMarkdownOutput(matchedPrimitives, aiResult);
    await ensureDirectory(join(DATA_DIR, "tmp"));
    await writeFile(OUTPUT_PATH, markdownOutput);

  } catch (error) {
    console.error('Error:', error.message);
    Deno.exit(1);
  }
}

async function loadPromptTemplate(): Promise<string> {
  console.log(`Loading prompt template from ${PROMPT_PATH}`);
  return await Deno.readTextFile(PROMPT_PATH);
}

async function loadConfig(): Promise<{ indexPath: string }> {
  try {
    const configText = await readFile('config.json');
    return JSON.parse(configText);
  } catch (error) {
    console.error('Error reading config file:', error);
    throw error;
  }
}

async function loadIndexData(indexPath: string): Promise<IndexData> {
  try {
    await Deno.stat(indexPath);
  } catch {
    console.error(`Error: Could not find index file at ${indexPath}`);
    Deno.exit(1);
  }
  const indexData: IndexData = JSON.parse(await readFile(indexPath));
  console.log(`Successfully loaded index from ${indexPath}`);
  return indexData;
}

async function loadUserPrompt(): Promise<string> {
  try {
    let prompt = await readFile('./tmp/user.txt');
    prompt = prompt.trim();
    if (!prompt) {
      throw new Error('Prompt file is empty');
    }
    return prompt;
  } catch (error) {
    console.error('Error reading prompt file: /tmp/user.txt');
    throw error;
  }
}

function generateEvaluationContent(prompt: string, aiResult: AIResponse, matchedPrimitives: Primitive[]): string {
  const composedTags = new Set<string>();
  matchedPrimitives.forEach(primitive => {
    primitive.tags.forEach(tag => composedTags.add(tag));
  });

  return `AI Analysis Results
==================
Prompt: "${prompt}"

Detected Language: ${aiResult.detectedLanguage || 'None detected'}

Initial Tags Selected by LLM:
${aiResult.tags.map(tag => `- ${tag}`).join('\n')}

AI Reasoning:
${aiResult.reasoning}

Matched Primitives and Their Tags:
${matchedPrimitives.map(p => 
  `- ${p.name}:\n  ${p.tags.map(t => `  - ${t}`).join('\n  ')}`
).join('\n')}

Final Composed Tags:
${Array.from(composedTags).sort().map(tag => `- ${tag}`).join('\n')}
`;
}

if (import.meta.main) {
  main();
} 