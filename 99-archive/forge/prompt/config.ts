// Configuration interface
export interface PromptConfig {
  outputDir: string;
  sourceDir: string;
  indexFile: string;
}

// Default configuration
export const defaultConfig: PromptConfig = {
  outputDir: "./data/output/prompts",
  sourceDir: "./data/prompt",
  indexFile: "index.json"
}; 