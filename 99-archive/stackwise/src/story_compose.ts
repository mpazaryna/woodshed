/**
 * @file story_compose.ts
 * @description Collects and stacks story primitives based on the specified story framework
 */

import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { readFile, writeFile, ensureDirectory } from "./utils.ts";

// Constants
const DATA_DIR = "data";
const getOutputPath = (framework: string, useMarkdown: boolean) => 
  join(DATA_DIR, "tmp", `${framework}-story.${useMarkdown ? 'md' : 'txt'}`);

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

interface PrimitiveWithContent extends Primitive {
  content: string;
  rawContent: string;
}

class StoryPrimitiveCollector {
  private index: IndexData;
  private componentOrder = ['base', 'structure', 'format', 'requirements', 'creative', 'improvements', 'advanced'];

  constructor(indexData: IndexData) {
    this.index = indexData;
  }

  private async readPrimitiveContent(primitive: Primitive): Promise<{ content: string; rawContent: string } | null> {
    try {
      const content = await readFile(primitive.path);
      
      // Find the end of frontmatter (marked by second ---)
      const frontmatterEnd = content.indexOf('---', 4); // Start after first '---'
      if (frontmatterEnd === -1) {
        throw new Error(`Invalid frontmatter in ${primitive.path}`);
      }
      
      // Get content after frontmatter
      let fileContent = content.slice(frontmatterEnd + 3).trim();

      // Remove the first H1 header (# Title) and any blank lines after it
      const h1Match = fileContent.match(/^#\s+[^\n]+\n+/);
      if (h1Match) {
        fileContent = fileContent.slice(h1Match[0].length).trim();
      }

      // Create a version without markdown
      const rawContent = fileContent
        .replace(/^#+\s+/gm, '') // Remove headers
        .replace(/\*\*/g, '')    // Remove bold
        .replace(/\*/g, '')      // Remove italics
        .replace(/`/g, '')       // Remove code blocks
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Replace links with just text
        .replace(/^\s*[-*+]\s+/gm, '• ') // Replace markdown lists with bullet points
        .replace(/^\s*\d+\.\s+/gm, '$1) ') // Replace numbered lists with numbers
        .trim();

      return { content: fileContent, rawContent };
    } catch (error) {
      console.error(`Error reading primitive ${primitive.path}:`, error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  async collectPrimitives(storyFramework: string): Promise<PrimitiveWithContent[]> {
    console.log(`\nCollecting primitives for ${storyFramework} framework:`);
    
    // Get all primitives that match the story framework, excluding format
    const storyPrimitives = this.index.primitives.filter(primitive => 
      primitive.tags.includes(storyFramework) && !primitive.tags.includes('format')
    );

    // Get format primitives from conventions directory
    const formatPrimitives = this.index.primitives.filter(primitive => 
      primitive.tags.includes('format') && primitive.path.includes('primitives/conventions')
    );

    // Combine and sort all primitives by component type order
    const allPrimitives = [...storyPrimitives, ...formatPrimitives];
    const sortedPrimitives = allPrimitives.sort((a, b) => {
      const aType = a.tags.find(tag => this.componentOrder.includes(tag)) || '';
      const bType = b.tags.find(tag => this.componentOrder.includes(tag)) || '';
      return this.componentOrder.indexOf(aType) - this.componentOrder.indexOf(bType);
    });

    // Read content for each primitive
    const primitivesWithContent: PrimitiveWithContent[] = [];
    for (const primitive of sortedPrimitives) {
      const result = await this.readPrimitiveContent(primitive);
      if (result) {
        primitivesWithContent.push({ 
          ...primitive, 
          content: result.content,
          rawContent: result.rawContent
        });
      }
    }

    return primitivesWithContent;
  }
}

function generateStackOutput(primitives: PrimitiveWithContent[], useMarkdown: boolean): string {
  const componentTypes = ['base', 'structure', 'format', 'requirements', 'creative', 'improvements', 'advanced'];
  let output = useMarkdown ? 'Story Stack\n==========\n\n' : 'STORY STACK\n\n';

  for (const componentType of componentTypes) {
    const components = primitives.filter(p => p.tags.includes(componentType));
    if (components.length > 0) {
      if (useMarkdown) {
        output += `${componentType.toUpperCase()}\n${'-'.repeat(componentType.length)}\n\n`;
      } else {
        output += `${componentType.toUpperCase()}\n${'-'.repeat(20)}\n\n`;
      }
      components.forEach(p => {
        output += `${useMarkdown ? p.content : p.rawContent}\n\n`;
      });
    }
  }

  return output;
}

async function main() {
  try {
    const args = parse(Deno.args, {
      string: ['story-framework'],
      boolean: ['markdown'],
      default: { 
        'story-framework': 'hero',
        'markdown': true
      }
    });

    const storyFramework = args['story-framework'];
    const useMarkdown = args['markdown'];

    if (!['hero', 'aristotelian'].includes(storyFramework)) {
      throw new Error('Invalid story framework. Must be either "hero" or "aristotelian"');
    }

    const config = await loadConfig();
    const indexData = await loadIndexData(config.indexPath);

    const collector = new StoryPrimitiveCollector(indexData);
    const matchedPrimitives = await collector.collectPrimitives(storyFramework);

    if (matchedPrimitives.length === 0) {
      console.log(`No primitives found for ${storyFramework} framework`);
      Deno.exit(0);
    }

    const stackOutput = generateStackOutput(matchedPrimitives, useMarkdown);
    await ensureDirectory(join(DATA_DIR, "tmp"));
    const outputPath = getOutputPath(storyFramework, useMarkdown);
    await writeFile(outputPath, stackOutput);

    console.log(`\nFound ${matchedPrimitives.length} primitives for ${storyFramework} framework`);
    console.log(`Stack output written to ${outputPath}`);
    console.log(`Format: ${useMarkdown ? 'Markdown' : 'Plain text'}`);

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
    Deno.exit(1);
  }
}

async function loadConfig(): Promise<{ indexPath: string }> {
  try {
    const configText = await readFile('config.json');
    return JSON.parse(configText);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error reading config file:', error.message);
    }
    throw new Error('Failed to load config');
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

if (import.meta.main) {
  main();
} 