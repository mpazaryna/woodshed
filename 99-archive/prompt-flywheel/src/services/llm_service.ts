import { ClaudeService } from "./claude.ts";
import { llmConfig } from "../config/llm_config.ts";

export interface LLMServiceConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
}

export interface LLMService {
  generateContent(prompt: string): Promise<string>;
}

export class ClaudeLLMService implements LLMService {
  private claudeService: ClaudeService;
  
  constructor(config: Partial<LLMServiceConfig> = {}) {
    // Get default config and merge with provided config
    const defaultConfig = llmConfig.services.claude;
    const mergedConfig = { ...defaultConfig, ...config };
    
    const apiKey = mergedConfig.apiKey ?? Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY must be provided in config or environment variables");
    }
    this.claudeService = new ClaudeService(apiKey);
  }

  async generateContent(prompt: string): Promise<string> {
    return this.claudeService.generateContent(prompt);
  }
}

export class LLMServiceFactory {
  static create(type: "claude", config: Partial<LLMServiceConfig> = {}): LLMService {
    switch (type) {
      case "claude":
        return new ClaudeLLMService(config);
      default:
        throw new Error(`Unsupported LLM service type: ${type}`);
    }
  }
} 