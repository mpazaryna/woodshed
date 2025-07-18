/**
 * @module analyze
 * @description A comprehensive analysis system for story frameworks and primitives.
 * This module provides functionality to analyze markdown-based story framework files,
 * evaluate their quality across multiple dimensions, and generate detailed analysis reports.
 * It uses the Anthropic Claude API for intelligent analysis and generates both individual
 * analysis files and summary reports.
 * 
 * @requires deno/std/flags
 * @requires deno/std/fs
 * @requires deno/std/yaml
 */

// analyze.ts
import { parse } from "https://deno.land/std/flags/mod.ts";
import { walk } from "https://deno.land/std/fs/mod.ts";
import { parse as parseYaml } from "https://deno.land/std/yaml/mod.ts";

/**
 * @interface AnalysisScore
 * @description Represents the comprehensive analysis results for a story framework primitive.
 * Includes both numerical scores across different dimensions and detailed qualitative feedback.
 */
interface AnalysisScore {
  /** @property {number} clarity - Score for how clear and understandable the framework is (0-10) */
  clarity: number;
  /** @property {number} consistency - Score for internal consistency and coherence (0-10) */
  consistency: number;
  /** @property {number} efficiency - Score for how efficiently the framework achieves its goals (0-10) */
  efficiency: number;
  /** @property {number} modularity - Score for how well the framework can be broken down and reused (0-10) */
  modularity: number;
  /** @property {number} total - Aggregate score across all dimensions (0-40) */
  total: number;
  /** @property {Object} details - Qualitative analysis details */
  details: {
    /** @property {string[]} strengths - List of identified strengths */
    strengths: string[];
    /** @property {string[]} weaknesses - List of identified weaknesses */
    weaknesses: string[];
    /** @property {string[]} improvement_areas - Specific suggestions for improvement */
    improvement_areas: string[];
  };
}

/**
 * @async
 * @function loadTemplate
 * @description Loads an analysis template file based on the specified type.
 * Templates are used to structure the analysis prompts sent to the AI model.
 * 
 * @param {string} type - The type of template to load (e.g., 'analyze')
 * @returns {Promise<string>} The contents of the template file
 * @throws {Error} If the template file cannot be loaded
 */
async function loadTemplate(type: string): Promise<string> {
  try {
    return await Deno.readTextFile(`./data/templates/eval/${type}-template.md`);
  } catch (error) {
    throw new Error(`Failed to load template: ${error.message}`);
  }
}

/**
 * @async
 * @function analyzePrompt
 * @description Sends content to the Anthropic Claude API for analysis and receives structured feedback.
 * Requires an ANTHROPIC_API_KEY environment variable to be set.
 * 
 * @param {string} content - The story framework content to analyze
 * @returns {Promise<string>} The structured analysis response from the AI model
 * @throws {Error} If the API key is not set or if the API request fails
 */
async function analyzePrompt(content: string): Promise<string> {
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY environment variable not set");
  }

  // Load the analysis template
  const template = await loadTemplate('analyze');
  const prompt = template.replace('{CONTENT}', content);

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
      system: "You are an expert in analyzing story frameworks of all types. Analyze each framework within its own context and principles, not comparing it to other frameworks."
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.statusText}\nDetails: ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * @function parseAnalysisResponse
 * @description Parses the raw AI model response into a structured AnalysisScore object.
 * Extracts numerical scores and qualitative feedback from the formatted response.
 * 
 * @param {string} response - The raw response from the AI model
 * @returns {AnalysisScore} A structured object containing all analysis results
 */
function parseAnalysisResponse(response: string): AnalysisScore {
  const sections = response.split('\n\n');
  const scores: any = {};
  const details: any = {
    strengths: [],
    weaknesses: [],
    improvement_areas: []
  };

  for (const section of sections) {
    if (section.startsWith('SCORES')) {
      const scoreLines = section.split('\n').slice(1);
      for (const line of scoreLines) {
        const [key, value] = line.split(': ');
        scores[key] = parseInt(value);
      }
    } else if (section.startsWith('STRENGTHS')) {
      details.strengths = section
        .split('\n')
        .slice(1)
        .filter(line => line.startsWith('-'))
        .map(line => line.slice(2).trim());
    } else if (section.startsWith('WEAKNESSES')) {
      details.weaknesses = section
        .split('\n')
        .slice(1)
        .filter(line => line.startsWith('-'))
        .map(line => line.slice(2).trim());
    } else if (section.startsWith('IMPROVEMENT_AREAS')) {
      details.improvement_areas = section
        .split('\n')
        .slice(1)
        .filter(line => line.startsWith('-'))
        .map(line => line.slice(2).trim());
    }
  }

  return {
    clarity: scores.clarity || 0,
    consistency: scores.consistency || 0,
    efficiency: scores.efficiency || 0,
    modularity: scores.modularity || 0,
    total: Object.values(scores).reduce((a: number, b: number) => a + b, 0),
    details
  };
}

/**
 * @async
 * @function main
 * @description Main execution function that orchestrates the analysis process.
 * - Processes command line arguments
 * - Finds markdown files in the specified directory
 * - Analyzes each file using the AI model
 * - Generates individual analysis files and a summary report
 * 
 * @throws {Error} If directory structure is invalid or file operations fail
 */
async function main() {
  const args = parse(Deno.args, {
    string: ['dir'],
    default: { dir: '.' }
  });

  // Extract the relative path after "primitives/"
  const pathMatch = args.dir.match(/primitives\/(.+)/);
  if (!pathMatch) {
    console.error("Directory must be under a 'primitives' folder");
    Deno.exit(1);
  }
  const relativePath = pathMatch[1];
  const analysisBaseDir = `./data/analysis/${relativePath}`;

  // Ensure analysis directory exists
  await Deno.mkdir(analysisBaseDir, { recursive: true });

  // Find all markdown files
  const primitives = [];
  for await (const entry of walk(args.dir, { exts: ['.md'] })) {
    if (entry.isFile && !entry.path.endsWith('-analysis.md')) {
      primitives.push(entry.path);
    }
  }

  console.log(`Found ${primitives.length} primitives to analyze\n`);

  const results: Record<string, AnalysisScore> = {};
  let totalScore = 0;

  for (const path of primitives) {
    const filename = path.split('/').pop()!;
    const analysisPath = `${analysisBaseDir}/${filename.replace('.md', '-analysis.md')}`;
    
    console.log(`Analyzing ${filename}...`);
    
    try {
      const content = await Deno.readTextFile(path);
      const response = await analyzePrompt(content);
      const analysis = parseAnalysisResponse(response);
      results[path] = analysis;
      totalScore += analysis.total;

      // Write analysis to file
      const analysisContent = `# Analysis Results for ${filename}

## Scores
- Clarity: ${analysis.clarity}/10
- Consistency: ${analysis.consistency}/10
- Efficiency: ${analysis.efficiency}/10
- Modularity: ${analysis.modularity}/10
- Total Score: ${analysis.total}/40

## Strengths
${analysis.details.strengths.map(s => `- ${s}`).join('\n')}

## Weaknesses
${analysis.details.weaknesses.map(w => `- ${w}`).join('\n')}

## Improvement Areas
${analysis.details.improvement_areas.map(i => `- ${i}`).join('\n')}
`;

      await Deno.writeTextFile(analysisPath, analysisContent);
      console.log(`Analysis written to ${analysisPath}\n`);
    } catch (error) {
      console.error(`Error analyzing ${path}:`, error);
    }
  }

  // Write summary report in the analysis directory
  const summaryPath = `${analysisBaseDir}/analysis-summary.md`;
  const summaryContent = `# Prompt Analysis Summary

## Overall Statistics
- Total primitives analyzed: ${primitives.length}
- Average score: ${(totalScore / primitives.length).toFixed(2)}/40

## Individual Scores
${Object.entries(results)
  .map(([path, analysis]) => `
### ${path.split('/').pop()}
Total Score: ${analysis.total}/40
- Clarity: ${analysis.clarity}/10
- Consistency: ${analysis.consistency}/10
- Efficiency: ${analysis.efficiency}/10
- Modularity: ${analysis.modularity}/10

Top improvement areas:
${analysis.details.improvement_areas.map(area => `- ${area}`).join('\n')}
`).join('\n')}
`;

  await Deno.writeTextFile(summaryPath, summaryContent);
  console.log(`Summary written to ${summaryPath}`);
}

if (import.meta.main) {
  main();
}
//deno run --allow-read --allow-write --allow-env --allow-net analyze.ts --dir --dir ./data/primitives/system/story/three-act