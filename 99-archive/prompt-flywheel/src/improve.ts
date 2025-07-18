import { join } from "https://deno.land/std/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { LLMService, LLMServiceFactory } from './services/llm_service.ts';
import { evaluateContent, EvaluationResult } from './evaluate.ts';

type EnhanceConfig = {
  targetScore: number;
  maxIterations: number;
  outputDir: string;
  domain: string;
  isAdvanced: boolean;
}

type EnhanceResult = {
  content: string;
  evaluation: EvaluationResult;
  iterations: number;
}

type Strategy = {
  name: string;
  generatePrompt: (content: string, evaluation: EvaluationResult) => string;
}

const strategies = {
  comprehensive: {
    name: 'comprehensive',
    generatePrompt: (content: string, evaluation: EvaluationResult) => `
Rewrite the following content to address these recommendations:
${evaluation.recommendations.join('\n')}

Original content:
${content}`
  },
  
  targeted: {
    name: 'targeted',
    generatePrompt: (content: string, evaluation: EvaluationResult) => {
      const lowScoringSections = Object.entries(evaluation.scoringBreakdown)
        .filter(([_, scores]) => scores.score < scores.maxScore * 0.8)
        .map(([section]) => section);
      
      return `
Improve the following sections while maintaining the rest of the content:
${lowScoringSections.join(', ')}

Recommendations for these sections:
${evaluation.recommendations.filter(r => 
  lowScoringSections.some(s => r.toLowerCase().includes(s.toLowerCase()))
).join('\n')}

Original content:
${content}`
    }
  }
};

const calculateScore = (evaluation: EvaluationResult): number =>
  (evaluation.totalScore / evaluation.maxPossibleScore) * 100;

const selectStrategy = (evaluation: EvaluationResult): Strategy =>
  calculateScore(evaluation) < 50 ? strategies.comprehensive : strategies.targeted;

const saveContent = async (
  content: string,
  iteration: number,
  strategy: string,
  outputDir: string
): Promise<string> => {
  const filename = `iteration-${iteration}-${strategy}.md`;
  const path = join('output', outputDir, filename);
  await Deno.writeTextFile(path, content);
  return filename;
};

const shouldContinue = (
  currentScore: number,
  targetScore: number,
  iteration: number,
  maxIterations: number
): boolean =>
  currentScore < targetScore && iteration < maxIterations;

const improveContent = async (
  content: string,
  evaluation: EvaluationResult,
  llmService: LLMService
): Promise<string> => {
  const strategy = selectStrategy(evaluation);
  const prompt = strategy.generatePrompt(content, evaluation);
  return llmService.generateContent(prompt);
};

async function enhance(
  content: string,
  config: EnhanceConfig,
  llmService: LLMService
): Promise<EnhanceResult> {
  await ensureDir(join('output', config.outputDir));
  
  let currentContent = content;
  let currentEval = await evaluateContent(content, config.domain, config.isAdvanced);
  let iteration = 0;
  
  console.log(`Initial score: ${calculateScore(currentEval).toFixed(1)}%`);
  
  while (shouldContinue(calculateScore(currentEval), config.targetScore, iteration, config.maxIterations)) {
    iteration++;
    console.log(`\nIteration ${iteration}/${config.maxIterations}`);
    
    const improvedContent = await improveContent(currentContent, currentEval, llmService);
    await saveContent(improvedContent, iteration, selectStrategy(currentEval).name, config.outputDir);
    
    const newEval = await evaluateContent(improvedContent, config.domain, config.isAdvanced);
    const currentScore = calculateScore(currentEval);
    const newScore = calculateScore(newEval);
    
    console.log(`New score: ${newScore.toFixed(1)}%`);
    
    if (newScore > currentScore) {
      currentContent = improvedContent;
      currentEval = newEval;
      console.log(`Improvement saved: +${(newScore - currentScore).toFixed(1)}%`);
    } else {
      console.log('No improvement, keeping previous version');
    }
  }

  return { content: currentContent, evaluation: currentEval, iterations: iteration };
}

if (import.meta.main) {
  const [domain, outputDir, advanced = "false", targetScore = "90", maxIterations = "3"] = Deno.args;

  if (!domain || !outputDir) {
    console.error("Usage: deno run llm_improve.ts <domain> <outputDir> [advanced] [targetScore] [maxIterations]");
    Deno.exit(1);
  }

  const initialContent = await Deno.readTextFile(join('output', outputDir, 'created.md'));
  const llmService = LLMServiceFactory.create("claude");
  
  enhance(initialContent, {
    domain,
    outputDir,
    isAdvanced: advanced === "true",
    targetScore: parseFloat(targetScore),
    maxIterations: parseInt(maxIterations)
  }, llmService)
    .then(result => console.log(`\nImprovement complete. Final score: ${
      calculateScore(result.evaluation).toFixed(1)
    }%`))
    .catch(error => {
      console.error('Error:', error.message);
      Deno.exit(1);
    });
}