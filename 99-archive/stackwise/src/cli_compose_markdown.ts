// cli_stack_markdown.ts

import { parse } from "https://deno.land/std@0.208.0/flags/mod.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { DomainHandlerFactory, Config, Primitive } from "./stacker.ts";

const BASE_PATH = "data/idx/system";

class StackWizard {
  private config: Config;
  private primitives: Primitive[];
  private domain: string;

  constructor(config: Config, primitives: Primitive[], domain: string) {
    this.config = config;
    this.primitives = primitives;
    this.domain = domain;
  }

  private async writeOutput(output: string) {
    await Deno.mkdir("data/tmp", { recursive: true });
    await Deno.writeTextFile("data/tmp/stack.md", output);
    
    console.log("\nStack configuration has been generated!");
    console.log("Output written to: data/tmp/stack.md");
  }

  private async writeRules(selectedPaths: string[]) {
    let ruleContent = `# Context Rules\n\n`;
    ruleContent += `## Domain: ${this.domain}\n\n`;
    
    // Group primitives by category
    const categoryMap = new Map<string, Primitive[]>();
    
    selectedPaths.forEach(path => {
      const primitive = this.primitives.find(p => p.path === path);
      if (!primitive) return;
      
      if (!categoryMap.has(primitive.category)) {
        categoryMap.set(primitive.category, []);
      }
      categoryMap.get(primitive.category)?.push(primitive);
    });

    // Generate rules for each category
    for (const [category, primitives] of categoryMap) {
      ruleContent += `### ${category}\n\n`;
      
      for (const primitive of primitives) {
        const name = primitive.name.replace(/^clean-code-/, '').toUpperCase();
        ruleContent += `#### ${name}\n\n`;
        ruleContent += `**Description:** ${primitive.description}\n\n`;
        ruleContent += `**Implementation:** Implement according to ${category} principles\n\n`;
        if (primitive.tags.length > 0) {
          ruleContent += '**Tags:**\n';
          primitive.tags.forEach(tag => {
            ruleContent += `- ${tag}\n`;
          });
          ruleContent += '\n';
        }
      }
    }

    await Deno.mkdir("data/tmp", { recursive: true });
    await Deno.writeTextFile("data/tmp/clc.md", ruleContent);
    console.log("Rules written to: data/tmp/clc.md");
  }

  public async start() {
    console.log(`\nWelcome to the Stack Builder Wizard! (${this.domain} domain)\n`);
    console.log(`Domain Description: ${this.config.domain.description}\n`);

    try {
      const domainHandler = await DomainHandlerFactory.createHandler(this.domain);
      await domainHandler.initialize(this.config, this.primitives);

      const result = await domainHandler.getSelectionFlow();
      
      if (await domainHandler.validateSelections()) {
        const selectedPrimitives = Array.from(result.selectedPrimitives);
        const output = await domainHandler.generateOutput(selectedPrimitives);
        await this.writeOutput(output);
        await this.writeRules(selectedPrimitives);
        
        // Print summary if available
        if (result.context?.language) {
          console.log(`\nSelected primitives for ${result.context.language}:`);
          selectedPrimitives.forEach(path => {
            const primitive = this.primitives.find(p => p.path === path);
            if (primitive) {
              console.log(`- ${primitive.name} (${primitive.category})`);
            }
          });
        }
      } else {
        console.log("\nNo valid selections were made. The output files will not be generated.");
      }
    } catch (error) {
      console.error(`Error in domain handler: ${error.message}`);
      throw error;
    }
  }
}

async function promptDomainSelection(domains: string[]): Promise<string> {
  console.log("\nWelcome to the Stack Builder!");
  console.log("\nAvailable domains:");
  domains.forEach((d, i) => {
    console.log(`${i + 1}. ${d}`);
  });

  while (true) {
    const buf = new Uint8Array(1024);
    await Deno.stdout.write(new TextEncoder().encode(`\nSelect domain (1-${domains.length}): `));
    const n = await Deno.stdin.read(buf);
    if (n === null) {
      throw new Error("Failed to read input");
    }
    
    const answer = new TextDecoder().decode(buf.subarray(0, n)).trim();
    const selection = parseInt(answer);
    
    if (!isNaN(selection) && selection >= 1 && selection <= domains.length) {
      return domains[selection - 1];
    }
    console.log("Invalid selection. Please try again.");
  }
}

async function main() {
  try {
    // Define available domains
    const availableDomains = ["compute", "art", "yoga"];
    
    // Get domain selection
    const domain = await promptDomainSelection(availableDomains);
    const domainPath = join(BASE_PATH, domain);

    // Load configuration
    const configPath = join(domainPath, "config.json");
    const configText = await Deno.readTextFile(configPath);
    const config = JSON.parse(configText);

    // Load index
    const indexPath = join(domainPath, "index.json");
    const indexText = await Deno.readTextFile(indexPath);
    const indexData = JSON.parse(indexText);

    const wizard = new StackWizard(config, indexData.primitives, domain);
    await wizard.start();

  } catch (error) {
    console.error("Error:", error.message);
    if (error instanceof Deno.errors.NotFound) {
      console.error(`Could not find required files in data/idx/system/${domain}/`);
    }
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
} 