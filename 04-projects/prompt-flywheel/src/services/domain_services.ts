import { join } from "https://deno.land/std@0.219.0/path/mod.ts";

export interface Section {
  name: string;
  required: boolean;
}

export interface DomainConfig {
  path: string;
  sections: Section[];
}

export const DEFAULT_SECTIONS: Section[] = [
  { name: "base", required: true },
  { name: "requirements", required: true },
  { name: "creative", required: true },
  { name: "advanced", required: false },
  { name: "structure", required: true },
];

export class DomainService {
  async discoverDomains(): Promise<Record<string, DomainConfig>> {
    const domains: Record<string, DomainConfig> = {};
    try {
      for await (const dirEntry of Deno.readDir("prompts")) {
        if (dirEntry.isDirectory) {
          domains[dirEntry.name] = {
            path: dirEntry.name,
            sections: DEFAULT_SECTIONS
          };
        }
      }
      return domains;
    } catch (error) {
      throw error;
    }
  }

  isValidDomain(domain: string, domains: Record<string, DomainConfig>): boolean {
    return domain in domains;
  }

  async readPromptSection(domain: string, section: string): Promise<string> {
    try {
      return await Deno.readTextFile(join("prompts", domain, `${section}.txt`));
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return "";
      }
      throw error;
    }
  }

  async buildFullPrompt(domain: string, sections: string[] = [], domains: Record<string, DomainConfig>): Promise<string> {
    let fullPrompt = "";
    for (const section of domains[domain].sections) {
      if (section.required || sections.includes(section.name)) {
        const content = await this.readPromptSection(domain, section.name);
        if (content || section.required) {
          fullPrompt += content + "\n\n";
        }
      }
    }
    return fullPrompt.trim();
  }
} 