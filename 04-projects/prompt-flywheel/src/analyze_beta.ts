// src/analyze.ts
import { PromptConfig, runPrompt, createOutputPath } from "./services/prompt_runner.ts";
import { join } from "https://deno.land/std@0.219.0/path/mod.ts";

type AnalysisConfig = {
 scriptPath: string;
 outputDir: string;
 promptPath: string;
};

const analyzeScript = async (config: AnalysisConfig): Promise<void> => {
 try {
   const analysis = await runPrompt({
     inputPath: config.scriptPath,
     outputDir: config.outputDir,
     promptPath: config.promptPath,
     validator: (content) => content.length > 1000
   });
   
   const outputDir = await createOutputPath(config.outputDir);
   await Deno.writeTextFile(join(outputDir, "analysis.md"), analysis);
   await Deno.writeTextFile(join(outputDir, "prompt.txt"), 
     await Deno.readTextFile(config.promptPath));
   
   console.log(`Analysis saved to: ${outputDir}`);
 } catch (error) {
   console.error("Analysis failed:", error);
   throw error;
 }
};

if (import.meta.main) {
 const config: AnalysisConfig = {
   scriptPath: "./data/seinfeld.md",
   outputDir: "./output",
   promptPath: "./prompts/analysis/sitcom-structure.txt"
 };
 
 analyzeScript(config).catch(error => {
   console.error("Unhandled error:", error);
   Deno.exit(1);
 });
}