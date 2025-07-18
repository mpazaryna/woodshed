// eval.ts
import { join } from "https://deno.land/std@0.219.0/path/mod.ts";
import { readPromptSections } from "./evaluator/prompt-reader.ts";
import { extractCriteria } from "./evaluator/criteria-extractor.ts";
import { evaluateContent as evaluateContentInternal } from "./evaluator/content-evaluator.ts";
import { generateMarkdownReport } from "./evaluator/markdown-generator.ts";
import { ensureOutputDir } from "./utils/file.ts";
import { DetailedReport } from "./evaluator/types.ts";
import { LLMServiceFactory } from "./services/llm_service.ts";

export interface DetailedBreakdown {
  [section: string]: {
    met: number;
    total: number;
    details: Array<{
      criterion: string;
      met: boolean;
      examples: string[];
    }>;
  };
}

export interface EvaluationResult {
  totalScore: number;
  maxPossibleScore: number;
  scoringBreakdown: Record<string, { score: number; maxScore: number }>;
  recommendations: string[];
  results: Array<{
    section: string;
    criterion: string;
    found: boolean;
    examples: string[];
  }>;
}

export async function evaluateContent(
  content: string, 
  domain: string, 
  isAdvanced: boolean = false
): Promise<EvaluationResult> {
  const llmService = LLMServiceFactory.create("claude");
  const promptContents = await readPromptSections(domain, isAdvanced);
  const criteria = extractCriteria(promptContents);
  return evaluateContentInternal(content, criteria, llmService);
}

async function main() {
  const [domain, outputDir, advancedMode, inputFilename = 'created.md'] = Deno.args;
  const isAdvanced = advancedMode === "advanced";
  
  const fullInputPath = join('output', outputDir, inputFilename);
  const fullOutputDir = join('output', outputDir);
  await ensureOutputDir(fullOutputDir);

  try {
    console.log(`Reading content from: ${fullInputPath}`);
    const content = await Deno.readTextFile(fullInputPath);
    const evaluation = await evaluateContent(content, domain, isAdvanced);

    const jsonFile = join(fullOutputDir, 'evaluation.json');
    const mdFile = join(fullOutputDir, 'evaluation.md');
    
    await Deno.writeTextFile(jsonFile, JSON.stringify(evaluation, null, 2));
    
    const detailedBreakdown = evaluation.results.reduce((acc, result) => {
      if (!acc[result.section]) {
        acc[result.section] = {
          met: 0,
          total: 0,
          details: []
        };
      }
      acc[result.section].total++;
      if (result.found) acc[result.section].met++;
      acc[result.section].details.push({
        criterion: result.criterion,
        met: result.found,
        examples: result.examples || []
      });
      return acc;
    }, {} as DetailedBreakdown);
    
    const markdownContent = generateMarkdownReport(inputFilename, domain, evaluation, detailedBreakdown);
    await Deno.writeTextFile(mdFile, markdownContent);
    
    console.log(`\nEvaluation Summary:`);
    console.log(`Score: ${evaluation.totalScore}/${evaluation.maxPossibleScore}`);
    console.log(`Reports written to: ${jsonFile} and ${mdFile}`);

  } catch (error) {
    console.error("\nError during evaluation:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}