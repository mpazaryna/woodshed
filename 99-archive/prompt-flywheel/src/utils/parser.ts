import { join } from "https://deno.land/std/path/mod.ts";

// Simple ID generator
let idCounter = 0;
const generateId = () => `id_${++idCounter}`;

interface ParserOptions {
  sectionDelimiter?: string;
  subsectionDelimiter?: string;
}

class MarkdownParser {
  private options: Required<ParserOptions>;

  constructor(options: ParserOptions = {}) {
    this.options = {
      sectionDelimiter: '\n## ',
      subsectionDelimiter: '\n### ',
      ...options
    };
  }

  protected generateId(): string {
    return generateId();
  }

  async parseFile<T>(filePath: string, parser: (content: string[]) => T): Promise<T> {
    const content = await Deno.readTextFile(filePath);
    const sections = content.split(this.options.sectionDelimiter);
    return parser(sections);
  }

  protected findSection(sections: string[], startsWith: string): string | undefined {
    return sections.find(s => s.startsWith(startsWith));
  }

  protected extractBulletPoints(section: string | undefined): string[] {
    if (!section) return [];
    return section.split('\n* ')
      .slice(1)
      .map(point => point.trim());
  }

  protected extractValue(line: string): string {
    return line.split(':')[1].trim();
  }

  protected async ensureDir(path: string): Promise<void> {
    try {
      await Deno.mkdir(path, { recursive: true });
    } catch (error) {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }
  }

  protected async writeOutput(path: string, data: unknown): Promise<void> {
    await Deno.writeTextFile(path, JSON.stringify(data, null, 2));
  }
}

export { MarkdownParser, type ParserOptions }; 