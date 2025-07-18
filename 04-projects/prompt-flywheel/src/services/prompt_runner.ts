import { join } from "https://deno.land/std@0.219.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { crypto } from "https://deno.land/std/crypto/mod.ts";
import { LLMServiceFactory } from "./llm_service.ts";
import { PromptTemplate } from "npm:@langchain/core/prompts";

export type PromptConfig = {
 input: string;
 isInputPath?: boolean;
 outputDir: string;
 promptPath: string;
 validator?: (content: string) => boolean;
};

export const createOutputPath = async (baseDir: string): Promise<string> => {
 const randomBytes = new Uint8Array(4);
 crypto.getRandomValues(randomBytes);
 const randomId = Array.from(randomBytes)
   .map(b => b.toString(16).padStart(2, '0'))
   .join('')
   .slice(0, 8);
 
 const dirPath = join(baseDir, `${randomId}-output`);
 await ensureDir(dirPath);
 return dirPath;
};

export const runPrompt = async (config: PromptConfig): Promise<string> => {
 const input = config.isInputPath ? await Deno.readTextFile(config.input) : config.input;
 
 if (config.validator && !config.validator(input)) {
   throw new Error("Invalid input content");
 }
 
 const promptTemplate = await Deno.readTextFile(config.promptPath);
 const template = PromptTemplate.fromTemplate(promptTemplate);
 const formattedPrompt = await template.format({ CONCEPT: input });
 
 const llmService = LLMServiceFactory.create("claude");
 return llmService.generateContent(formattedPrompt);
};

