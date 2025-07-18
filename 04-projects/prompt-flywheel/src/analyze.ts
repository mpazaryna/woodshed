import { join } from "https://deno.land/std@0.219.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { crypto } from "https://deno.land/std/crypto/mod.ts";
import { LLMServiceFactory } from "./services/llm_service.ts";
import { PromptTemplate } from "npm:@langchain/core/prompts";

type AnalysisConfig = {
  scriptPath: string;
  outputDir: string;
  promptPath: string;
};

const setupLogging = async () => {
  await ensureDir("./logs");
  const logFile = await Deno.open("./logs/analyze.log", {
    write: true,
    append: true,
    create: true,
  });
  
  const logger = {
    info: async (message: string) => {
      const timestamp = new Date().toISOString();
      const logMessage = `[INFO] ${timestamp}: ${message}\n`;
      await logFile.write(new TextEncoder().encode(logMessage));
      console.log(message);
    },
    error: async (message: string, error?: Error) => {
      const timestamp = new Date().toISOString();
      const errorDetails = error ? `\n${error.stack}` : '';
      const logMessage = `[ERROR] ${timestamp}: ${message}${errorDetails}\n`;
      await logFile.write(new TextEncoder().encode(logMessage));
      console.error(message);
    }
  };
  
  return logger;
};

const validateScriptContent = async (content: string, logger: any): Promise<boolean> => {
  const minLength = 1000;
  const hasContent = content.length > minLength;
  await logger.info(`Content length: ${content.length}, Minimum required: ${minLength}`);
  return hasContent;
};

const readScript = async (filePath: string, logger: any): Promise<string> => {
  await logger.info(`Reading script: ${filePath}`);
  const content = await Deno.readTextFile(filePath);
  await logger.info(`Read ${content.length} characters`);
  return content;
};

const createOutputPath = async (baseDir: string, logger: any): Promise<string> => {
  const randomBytes = new Uint8Array(4);
  crypto.getRandomValues(randomBytes);
  const randomId = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 8);
  
  const dirPath = join(baseDir, `${randomId}-analysis`);
  await ensureDir(dirPath);
  await logger.info(`Created output directory: ${dirPath}`);
  return dirPath;
};

const formatPromptWithScript = (template: string, scriptContent: string): string => {
  return template.replace('{CONCEPT}', 
    `Below is a complete sitcom script for analysis:\n\n${scriptContent}\n\nAnalyze this script through the lens of traditional multi-camera sitcom structure.`
  );
};

const analyzeScript = async (config: AnalysisConfig): Promise<void> => {
  const logger = await setupLogging();
  
  try {
    await logger.info("Starting script analysis");
    const scriptContent = await readScript(config.scriptPath, logger);
    
    if (!await validateScriptContent(scriptContent, logger)) {
      throw new Error("Invalid script content - missing expected elements");
    }
    
    const promptTemplate = await Deno.readTextFile(config.promptPath);
    const formattedPrompt = formatPromptWithScript(promptTemplate, scriptContent);
    
    await logger.info("Generated formatted prompt");
    await logger.info(`Prompt preview: ${formattedPrompt.slice(0, 100)}...`);
    
    const llmService = LLMServiceFactory.create("claude");
    await logger.info("Initialized LLM service");
    
    const analysis = await llmService.generateContent(formattedPrompt);
    await logger.info("Generated analysis content");
    
    const outputDir = await createOutputPath(config.outputDir, logger);
    await Deno.writeTextFile(join(outputDir, "analysis.md"), analysis);
    await Deno.writeTextFile(join(outputDir, "prompt.txt"), formattedPrompt);
    
    await logger.info(`Analysis completed and saved to: ${outputDir}`);
  } catch (error) {
    await logger.error("Analysis failed", error as Error);
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
