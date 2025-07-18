import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { parse as parseYaml } from "https://deno.land/std/yaml/mod.ts";
import { defaultConfig, type PromptConfig } from "../config.ts";

interface PromptMetadata {
  name: string;
  description: string;
  tags: string[];
  files: {
    [key: string]: {
      description: string;
      tags: string[];
    };
  };
}

interface PromptIndex {
  meta: {
    create_date: string;
    description: string;
  };
  data: {
    [key: string]: {
      name: string;
      description: string;
      tags: string[];
      files: {
        [key: string]: {
          description: string;
          tags: string[];
          path: string;
        };
      };
    };
  };
}

export class Prompt {
  private static config: PromptConfig;

  static {
    // Initialize configuration
    try {
      const configFile = Deno.readFileSync("deno.json");
      const config = JSON.parse(new TextDecoder().decode(configFile));
      Prompt.config = config.prompt || defaultConfig;
    } catch {
      Prompt.config = defaultConfig;
    }
  }

  private static get OUTPUT_DIR(): string {
    return Prompt.config.outputDir;
  }

  private static get SOURCE_DIR(): string {
    return Prompt.config.sourceDir;
  }

  private static get INDEX_FILE(): string {
    return join(Prompt.SOURCE_DIR, Prompt.config.indexFile);
  }

  constructor(
    private name: string,
    private content: string,
    private tags: string[] = [],
  ) {}

  toString(): string {
    return this.content;
  }

  /**
   * Save the prompt to the output directory
   */
  async save(): Promise<void> {
    await ensureDir(Prompt.OUTPUT_DIR);
    const filePath = join(Prompt.OUTPUT_DIR, `${this.name}.txt`);
    await Deno.writeTextFile(filePath, this.content);
  }

  /**
   * Load a prompt from the output directory
   */
  static async load(name: string): Promise<Prompt> {
    const filePath = join(Prompt.OUTPUT_DIR, `${name}.txt`);
    const content = await Deno.readTextFile(filePath);
    return new Prompt(name, content);
  }

  /**
   * Get the name of the prompt
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get the tags associated with this prompt
   */
  getTags(): string[] {
    return [...this.tags];
  }

  /**
   * Stack multiple prompts from a directory into a single markdown file
   * @param folderName The name of the folder containing prompts to stack
   * @returns A new Prompt instance containing the stacked content
   */
  static async stack(folderName: string): Promise<Prompt> {
    const dirPath = join(Prompt.SOURCE_DIR, folderName);
    const stackedContent: string[] = [];
    
    try {
      // Read all files in the directory
      for await (const entry of Deno.readDir(dirPath)) {
        if (entry.isFile && entry.name.endsWith('.txt')) {
          const filePath = join(dirPath, entry.name);
          const content = await Deno.readTextFile(filePath);
          
          // Add file content as a section in markdown
          const sectionName = entry.name.replace('.txt', '');
          stackedContent.push(
            `## ${sectionName}\n\n${content}\n`
          );
        }
      }

      // Combine all sections into a single markdown document
      const finalContent = [
        `# ${folderName}`,
        ...stackedContent
      ].join('\n\n');

      // Create and save the stacked prompt
      const stackedPrompt = new Prompt(
        folderName,
        finalContent,
        ['stacked', folderName]
      );

      // Save to output directory with markdown extension
      await ensureDir(Prompt.OUTPUT_DIR);
      const outputPath = join(Prompt.OUTPUT_DIR, `${folderName}.md`);
      await Deno.writeTextFile(outputPath, finalContent);

      return stackedPrompt;
    } catch (error: unknown) {
      // Properly type check the error
      if (error instanceof Error) {
        throw new Error(`Failed to stack prompts from ${folderName}: ${error.message}`);
      }
      // If it's not an Error instance, convert it to string
      throw new Error(`Failed to stack prompts from ${folderName}: ${String(error)}`);
    }
  }

  /**
   * Read metadata from a directory
   */
  private static async readMetadata(dirPath: string): Promise<PromptMetadata | null> {
    try {
      const metaPath = join(dirPath, "meta.yaml");
      const content = await Deno.readTextFile(metaPath);
      return parseYaml(content) as PromptMetadata;
    } catch {
      return null;
    }
  }

  /**
   * Create an index of all prompts in the source directory
   */
  static async createIndex(): Promise<void> {
    const index: PromptIndex = {
      meta: {
        create_date: new Date().toISOString(),
        description: "Index generated from forge/prompt"
      },
      data: {},
    };

    try {
      // Read the root directory
      for await (const dirEntry of Deno.readDir(Prompt.SOURCE_DIR)) {
        if (dirEntry.isDirectory) {
          const dirPath = join(Prompt.SOURCE_DIR, dirEntry.name);
          const files: { [key: string]: { description: string; tags: string[]; path: string } } = {};

          // Try to read metadata
          const metadata = await Prompt.readMetadata(dirPath);

          // Read all files in the directory
          for await (const fileEntry of Deno.readDir(dirPath)) {
            if (fileEntry.isFile && fileEntry.name.endsWith('.txt')) {
              const fileName = fileEntry.name.replace('.txt', '');
              files[fileName] = {
                description: metadata?.files[fileName]?.description || fileName,
                tags: metadata?.files[fileName]?.tags || [],
                path: join(dirEntry.name, fileEntry.name),
              };
            }
          }

          // Add directory to index with metadata
          index.data[dirEntry.name] = {
            name: metadata?.name || dirEntry.name,
            description: metadata?.description || dirEntry.name,
            tags: metadata?.tags || [],
            files,
          };
        }
      }

      // Write the index file
      await ensureDir(Prompt.SOURCE_DIR);
      await Deno.writeTextFile(
        Prompt.INDEX_FILE,
        JSON.stringify(index, null, 2)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create prompt index: ${error.message}`);
      }
      throw new Error(`Failed to create prompt index: ${String(error)}`);
    }
  }

  /**
   * Read the prompt index
   */
  static async getIndex(): Promise<PromptIndex> {
    try {
      const content = await Deno.readTextFile(Prompt.INDEX_FILE);
      return JSON.parse(content) as PromptIndex;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to read prompt index: ${error.message}`);
      }
      throw new Error(`Failed to read prompt index: ${String(error)}`);
    }
  }
} 