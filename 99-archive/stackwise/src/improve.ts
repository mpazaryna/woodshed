/**
 * @module improve
 * @description A system for improving story framework primitives with specific enhancement focuses.
 * This module provides functionality to analyze and enhance markdown-based story framework files
 * across different dimensions like simplification, modularity, and flexibility. It uses the
 * Anthropic Claude API for intelligent improvements and can operate in dry-run mode.
 * 
 * @requires deno/std/flags
 * @requires deno/std/fs
 * @requires deno/std/yaml
 */

// improve.ts
import { parse } from "https://deno.land/std/flags/mod.ts";
import { walk } from "https://deno.land/std/fs/mod.ts";
import { parse as parseYaml } from "https://deno.land/std/yaml/mod.ts";

/**
 * @interface ImprovementFocus
 * @description Defines a specific area of improvement for story framework primitives.
 * Each focus area has its own specialized prompt template and improvement strategy.
 */
interface ImprovementFocus {
  /** @property {string} name - Unique identifier for the improvement focus */
  name: string;
  /** @property {string} description - Human-readable description of what this focus improves */
  description: string;
  /** @property {string} prompt_template - Template for generating improvement prompts */
  prompt_template: string;
}

/**
 * @constant {ImprovementFocus[]} IMPROVEMENT_FOCUSES
 * @description Predefined improvement focus areas with their respective templates.
 * Each focus targets a specific aspect of the framework for enhancement.
 */
const IMPROVEMENT_FOCUSES: ImprovementFocus[] = [
  {
    name: "simplification",
    description: "Streamline and simplify complex sections while maintaining core functionality",
    prompt_template: `Review this primitive content and simplify it while maintaining its core functionality:

{CONTENT}

Focus specifically on:
1. Removing unnecessary detail
2. Consolidating overlapping sections
3. Making complex concepts more accessible
4. Preserving essential functionality

Provide the simplified version in this format:

# CHANGES MADE
- [List specific simplifications made]

# SIMPLIFIED CONTENT
[Provide complete simplified content]`
  },
  {
    name: "modularity",
    description: "Break content into more modular, reusable components",
    prompt_template: `Review this primitive content and improve its modularity:

{CONTENT}

Focus on:
1. Identifying components that could be separate modules
2. Making components more independently usable
3. Reducing tight coupling between sections
4. Improving reusability

Provide the modularized version in this format:

# MODULES IDENTIFIED
- [List modules and their purposes]

# MODULARIZED CONTENT
[Provide complete modularized content]`
  },
  {
    name: "flexibility",
    description: "Make the content more adaptable to different use cases",
    prompt_template: `Review this primitive content and make it more flexible:

{CONTENT}

Focus on:
1. Making prescriptive elements more configurable
2. Adding adaptation guidance
3. Supporting different use cases
4. Maintaining structure while increasing flexibility

Provide the flexible version in this format:

# FLEXIBILITY IMPROVEMENTS
- [List specific flexibility enhancements]

# FLEXIBLE CONTENT
[Provide complete flexible content]`
  }
];

/**
 * @async
 * @function improvePrompt
 * @description Sends content to the Anthropic Claude API for improvement based on a specific focus area.
 * Uses specialized prompt templates to guide the AI in making targeted improvements.
 * 
 * @param {string} content - The story framework content to improve
 * @param {ImprovementFocus} focus - The specific improvement focus to apply
 * @returns {Promise<string>} The improved content from the AI model
 * @throws {Error} If the API key is not set or if the API request fails
 */
async function improvePrompt(content: string, focus: ImprovementFocus): Promise<string> {
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY environment variable not set");
  }

  const prompt = focus.prompt_template.replace("{CONTENT}", content);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-opus-20240229",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: prompt
        }]
      }],
      system: "You are an expert in improving prompt primitives with a focus on specific enhancement areas."
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * @async
 * @function main
 * @description Main execution function that orchestrates the improvement process.
 * - Processes command line arguments including focus area and dry-run mode
 * - Finds markdown files with existing analysis
 * - Applies improvements based on the selected focus
 * - Writes improved versions either as new files (dry-run) or in-place
 * 
 * Command line options:
 * --dir: Target directory (must be under 'primitives/')
 * --focus: Improvement focus area (simplification, modularity, flexibility)
 * --dry-run: Whether to create new files instead of modifying existing ones
 * 
 * @throws {Error} If directory structure is invalid or file operations fail
 */
async function main() {
  const args = parse(Deno.args, {
    string: ['dir', 'focus'],
    boolean: ['dry-run'],
    default: { 
      dir: '.',
      'dry-run': true
    }
  });

  const focus = IMPROVEMENT_FOCUSES.find(f => f.name === args.focus);
  if (!focus) {
    console.error(`Invalid focus area. Available options: ${IMPROVEMENT_FOCUSES.map(f => f.name).join(', ')}`);
    Deno.exit(1);
  }

  // Extract the relative path after "primitives/"
  const pathMatch = args.dir.match(/primitives\/(.+)/);
  if (!pathMatch) {
    console.error("Directory must be under a 'primitives' folder");
    Deno.exit(1);
  }
  const relativePath = pathMatch[1];
  
  const analysisBaseDir = `./data/analysis/${relativePath}`;
  const improveBaseDir = `./data/improve/${relativePath}`;

  // Ensure improve directory exists
  await Deno.mkdir(improveBaseDir, { recursive: true });

  // Find all primitives with analysis files
  const primitives = [];
  for await (const entry of walk(args.dir, { exts: ['.md'] })) {
    if (entry.isFile && !entry.path.includes('-analysis') && !entry.path.includes('-improved')) {
      const filename = entry.path.split('/').pop()!;
      const analysisPath = `${analysisBaseDir}/${filename.replace('.md', '-analysis.md')}`;
      
      try {
        await Deno.stat(analysisPath);
        console.log(`Found analysis file for ${filename}`);
        primitives.push(entry.path);
      } catch {
        console.log(`No analysis file found at ${analysisPath}`);
      }
    }
  }

  console.log(`\nFound ${primitives.length} primitives with analysis files`);
  console.log(`Improvement focus: ${focus.name} - ${focus.description}\n`);

  for (const path of primitives) {
    const filename = path.split('/').pop()!;
    console.log(`\nImproving ${filename}...`);
    
    try {
      const content = await Deno.readTextFile(path);
      const improved = await improvePrompt(content, focus);

      const outputPath = args['dry-run']
        ? `${improveBaseDir}/${filename.replace('.md', `-improved-${focus.name}.md`)}`
        : path;

      await Deno.writeTextFile(outputPath, improved);
      console.log(`Improvements written to ${outputPath}`);
    } catch (error) {
      console.error(`Error improving ${path}:`, error);
    }
  }
}

if (import.meta.main) {
  main();
}


//First run in dry-run mode (creates *-improved-{focus}.md files)
//deno run --allow-read --allow-write --allow-env --allow-net src/improve.ts --dir ./data/primitives/system/story/three-act --focus simplification

//# Other focus areas
//deno run --allow-read --allow-write --allow-env --allow-net src/improve.ts --dir ./primitives --focus modularity
//deno run --allow-read --allow-write --allow-env --allow-net src/improve.ts --dir ./primitives --focus flexibility

//# When ready to apply changes
//deno run --allow-read --allow-write --allow-env --allow-net src/improve.ts --dir ./primitives --focus simplification --no-dry-run