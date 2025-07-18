import { parse as parseXML } from "https://deno.land/x/xml/mod.ts";
//import { join } from "https://deno.land/std/path/mod.ts";
import { txt } from "./enum.ts";

interface TemplateIndex {
  version: string;
  meta: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
  primitives: {
    [key: string]: {
      name: string;
      path: string;
      description: string;
      tags: string[];
      required?: boolean;
      category: string;
    };
  };
}

interface FrameworkOption {
  id: string;
  name: string;
  tag: string;
  selected: boolean;
}

type PromptResult = string;
type CheckboxResult = string[];

class TemplateBuilder {
  private templateIndex: TemplateIndex;

  private async loadTemplateIndex(): Promise<void> {
    try {
      const indexContent = await Deno.readTextFile("data/idx/system/compute/index.json");
      this.templateIndex = JSON.parse(indexContent);
    } catch (error) {
      console.error("Error loading template index:", error);
      throw error;
    }
  }

  async promptUser(): Promise<Set<string>> {
    // Ensure index is loaded first
    await this.loadTemplateIndex();
    
    const selectedRules = new Set<string>();

    // Add required rules
    Object.values(this.templateIndex.primitives)
      .filter(rule => rule.required)
      .forEach(rule => selectedRules.add(rule.path));

    console.log("Welcome to the Template Builder!\n");
    console.log("I'll help you create a development ruleset for your project.\n");

    // Ask about project type
    const selectedProjectType = await this.prompt(
      "What type of project are you building?\n" +
      "1. Frontend Web Application\n" +
      "2. Backend Service\n" +
      "3. Full Stack Application\n" +
      "4. Library/Package\n" +
      "Choose (1-4): "
    );

    // Ask about specific framework/technology
    const frameworkOptions: FrameworkOption[] = [
      { id: "1", name: "Angular", tag: "angular", selected: false },
      { id: "2", name: "React", tag: "react", selected: false },
      { id: "3", name: "Vue", tag: "vue", selected: false },
      { id: "4", name: "Node.js", tag: "nodejs", selected: false },
      { id: "5", name: "Other", tag: "other", selected: false }
    ];

    const selectedFrameworks = await this.promptCheckboxes(
      frameworkOptions,
      "Which frameworks/technologies are you using?"
    );

    // Based on answers, suggest relevant rule sets
    for (const frameworkId of selectedFrameworks) {
      const framework = frameworkOptions.find(opt => opt.id === frameworkId);
      if (framework) {
        const rule = this.getRuleByTags([framework.tag]);
        if (rule) {
          selectedRules.add(rule.path);
        }
      }
    }

    // Ask about shortcode functions
    //const selectedShortcodes = await this.prompt(
    //  "\n" +
    //  "Slash Commands\n" +
    //  "----------\n" +
    //  "Shortcodes are canned prompts which can speed up development time.\n\n" +
    //  "Would you like to include any of the following?\n\n" +
    //  "[ TODO: Add list ]"
    //);
    
    // Ask about clean code principles
    console.log("\nWhich clean code principles would you like to include?");
    
    const cleanCodeRules = Object.values(this.templateIndex.primitives)
      .filter(rule => rule.tags.includes("clean-code") && !rule.required);

    // Ensure we have clean code rules to display
    if (cleanCodeRules.length === 0) {
      console.log("No clean code principles available.");
    } else {
      for (const rule of cleanCodeRules) {
        const include = await this.prompt(
          `\nInclude ${rule.name}?\n${rule.description}\n(y/n): `
        );
        if (include.toLowerCase() === 'y') {
          selectedRules.add(rule.path);
        }
      }
    }

    return selectedRules;
  }

  private getRuleByTags(tags: string[]): {
    name: string;
    path: string;
    description: string;
    tags: string[];
    required?: boolean;
    category: string;
  } | undefined {
    return Object.values(this.templateIndex.primitives).find(rule => 
      tags.some(tag => rule.tags.includes(tag))
    );
  }

  private async prompt(question: string): Promise<PromptResult> {
    const buf = new Uint8Array(1024);
    await Deno.stdout.write(new TextEncoder().encode(question));
    const n = await Deno.stdin.read(buf);
    if (n === null) {
      return "";
    }
    return new TextDecoder().decode(buf.subarray(0, n)).trim();
  }

  private async promptCheckboxes(options: FrameworkOption[], prompt: string): Promise<CheckboxResult> {
    let currentIndex = 0;
    const decoder = new TextDecoder();

    // Set up terminal for raw mode
    const originalRaw = Deno.stdin.isRaw;
    try {
      // @ts-ignore: Deno stdin API
      await Deno.stdin.setRaw(true);

      while (true) {
        console.clear();
        console.log(`${prompt}\n`);
        
        // Display options
        options.forEach((opt, index) => {
          const cursor = index === currentIndex ? ">" : " ";
          const checkbox = opt.selected ? "[x]" : "[ ]";
          const name = opt.name;
          console.log(`${cursor} ${checkbox} ${name}`);
        });
        console.log(`\nUse ${txt.underscore}arrow keys${txt.reset} to move, ${txt.underscore}space${txt.reset} to select, ${txt.underscore}enter${txt.reset} to confirm`);

        // Read key press
        const buf = new Uint8Array(8);
        const n = await Deno.stdin.read(buf);
        if (n === null) return [];
        
        const input = decoder.decode(buf.subarray(0, n));
        
        if (input.includes('\x1b[A')) { // Up arrow
          currentIndex = Math.max(0, currentIndex - 1);
        } else if (input.includes('\x1b[B')) { // Down arrow
          currentIndex = Math.min(options.length - 1, currentIndex + 1);
        } else if (input.includes(' ')) { // Space
          options[currentIndex].selected = !options[currentIndex].selected;
        } else if (input.includes('\r')) { // Enter
          return options
            .filter(opt => opt.selected)
            .map(opt => opt.id);
        }
      }
    } finally {
      // Restore terminal state
      // @ts-ignore: Deno stdin API
      await Deno.stdin.setRaw(originalRaw);
    }
  }

  async generateCompositionRoot(selectedRules: Set<string>): Promise<string> {
    const imports = Array.from(selectedRules)
      .map(rule => `    <import template="${rule}"/>`)
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<template name="composition-root">
  <cursorRules>
${imports}
  </cursorRules>
</template>`;
  }
}

async function main() {
  const builder = new TemplateBuilder();
  
  try {
    console.log("Template Builder\n");
    
    const selectedRules = await builder.promptUser();
    
    console.log("\nGenerating composition-root.xml...");
    const compositionRoot = await builder.generateCompositionRoot(selectedRules);
    
    // Ensure the directory exists
    await Deno.mkdir("data/tmp", { recursive: true });
    
    // Save the file in data/tmp
    await Deno.writeTextFile("data/tmp/composition.xml", compositionRoot);
    console.log("\nSuccess! composition.xml has been created in data/tmp.");
    console.log("You can now run the template loader to generate your complete template.");
    
  } catch (error) {
    console.error("\nError:", error.message);
    if (error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }
  }
}

if (import.meta.main) {
  main();
}