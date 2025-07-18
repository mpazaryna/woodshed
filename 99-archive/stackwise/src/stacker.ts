// Core interfaces for configuration
export interface Domain {
  name: string;
  version: string;
  description: string;
  filterStrategy: string;
}

export interface Language {
  name: string;
  aliases: string[];
  frameworks: string[];
}

export interface Tag {
  name: string;
  description: string;
  applicableToAll: boolean;
}

export interface TagTypes {
  generic: {
    description: string;
    tags: Tag[];
  };
  language_specific: {
    description: string;
    rules: {
      allowGenericWithSpecific: boolean;
      requireLanguageMatch: boolean;
    };
    tags: {
      [key: string]: string[];
    };
  };
}

export interface PromptTemplate {
  path: string;
  variables: {
    [key: string]: string;
  };
}

export interface OutputRules {
  includeGenericTags: boolean;
  includeLanguageTags: boolean;
  requireLanguageDetection: boolean;
  allowUnknownTags: boolean;
}

export interface Config {
  domain: Domain;
  contextTypes: {
    languages?: Language[];
    categories: string[];
  };
  tagTypes: TagTypes;
  promptTemplate: PromptTemplate;
  outputRules: OutputRules;
}

// Core interfaces for primitives
export interface Primitive {
  name: string;
  description: string;
  category: string;
  tags: string[];
  domain: string;
  path: string;
}

export interface Meta {
  filename: string;
  version: string;
  generated: string;
  count: number;
  domain: string;
}

export interface PrimitiveIndex {
  meta: Meta;
  primitives: Primitive[];
}

// Domain handler interfaces
export interface SelectionResult {
  selectedPrimitives: Set<string>;
  context?: {
    language?: string;
    categories?: string[];
    [key: string]: unknown;
  };
}

export interface DomainHandler {
  initialize(config: Config, primitives: Primitive[]): Promise<void>;
  getSelectionFlow(): Promise<SelectionResult>;
  validateSelections(): Promise<boolean>;
  generateOutput(selections: string[]): Promise<string>;
}

// Base handler implementation
export abstract class BaseDomainHandler implements DomainHandler {
  protected config: Config;
  protected primitives: Primitive[];
  protected selectedPrimitives: Set<string> = new Set();

  constructor() {
    this.config = {} as Config;
    this.primitives = [];
  }

  async initialize(config: Config, primitives: Primitive[]): Promise<void> {
    this.config = config;
    this.primitives = primitives;
  }

  abstract getSelectionFlow(): Promise<SelectionResult>;
  
  async validateSelections(): Promise<boolean> {
    return this.selectedPrimitives.size > 0;
  }

  async generateOutput(selections: string[]): Promise<string> {
    return `<?xml version="1.0" encoding="UTF-8"?>
<template name="stack-composition">
  <cursorRules>
${selections.map(path => `    <import template="${path}"/>`).join('\n')}
  </cursorRules>
</template>`;
  }

  protected async prompt(question: string): Promise<string> {
    const buf = new Uint8Array(1024);
    await Deno.stdout.write(new TextEncoder().encode(question));
    const n = await Deno.stdin.read(buf);
    if (n === null) {
      return "";
    }
    return new TextDecoder().decode(buf.subarray(0, n)).trim();
  }

  protected async promptMultiChoice(options: string[], prompt: string): Promise<number> {
    console.log(`\n${prompt}\n`);
    options.forEach((option, index) => {
      console.log(`${index + 1}. ${option}`);
    });
    
    while (true) {
      const answer = await this.prompt(`\nEnter number (1-${options.length}): `);
      const selection = parseInt(answer);
      if (!isNaN(selection) && selection >= 1 && selection <= options.length) {
        return selection - 1;
      }
      console.log("Invalid selection. Please try again.");
    }
  }

  protected async promptYesNo(question: string): Promise<boolean> {
    while (true) {
      const answer = await this.prompt(`${question} (y/n): `);
      if (answer.toLowerCase() === 'y') return true;
      if (answer.toLowerCase() === 'n') return false;
      console.log("Please answer 'y' or 'n'");
    }
  }

  // Utility methods for handling categories
  protected cleanCategoryName(category: string): string {
    return category.replace('.xml', '').trim();
  }

  protected getCategorizedPrimitives(): Map<string, Primitive[]> {
    const categorized = new Map<string, Primitive[]>();
    
    this.primitives.forEach(primitive => {
      const category = this.cleanCategoryName(primitive.category);
      if (!categorized.has(category)) {
        categorized.set(category, []);
      }
      categorized.get(category)!.push(primitive);
    });

    return categorized;
  }
}

// Factory for creating domain handlers
export class DomainHandlerFactory {
  static async createHandler(domain: string): Promise<DomainHandler> {
    switch (domain) {
      case "compute":
        const { ComputeDomainHandler } = await import("./domains/compute_handler.ts");
        return new ComputeDomainHandler();
      case "art":
        const { ArtDomainHandler } = await import("./domains/art_handler.ts");
        return new ArtDomainHandler();
      case "yoga":
        const { YogaDomainHandler } = await import("./domains/yoga_handler.ts");
        return new YogaDomainHandler();
      default:
        throw new Error(`Unsupported domain: ${domain}`);
    }
  }
}