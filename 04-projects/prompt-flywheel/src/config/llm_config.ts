import { LLMServiceConfig } from "../services/llm_service.ts";

export interface LLMConfiguration {
  defaultService: "claude";
  services: {
    claude: LLMServiceConfig;
  };
}

export const llmConfig: LLMConfiguration = {
  defaultService: "claude",
  services: {
    claude: {
      model: "claude-3-sonnet-20240229",
      maxTokens: 4096,
    },
  },
};

export function getLLMConfig(service?: keyof LLMConfiguration["services"]): LLMServiceConfig {
  const serviceType = service || llmConfig.defaultService;
  return llmConfig.services[serviceType];
} 