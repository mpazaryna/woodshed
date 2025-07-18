// Main entry point for the LLM module

// Re-export core types
export type {
  ClaudeModel,
  GeminiModel,
  SupportedModel,
  ModelProvider,
  Role,
  Message,
  Completion,
  LLMConfig,
  LLMClient,
  CreateLLMClient,
} from './src/types.ts'

// Re-export error class
export { LLMError } from './src/types.ts'

// Re-export client creators
export { createClaudeClient } from './src/clients/claude.ts'
export { createGeminiClient } from './src/clients/gemini.ts'
export { createDeepSeekClient } from './src/clients/deepseek.ts'
export { createMixtralClient } from './src/clients/mixtral.ts'
export { createOpenAIClient } from './src/clients/openai.ts'

// Re-export main factory function
export { createLLMClient } from './src/factory.ts'

// Re-export environment utilities
export { getApiKey } from './src/utils/env.ts'

// Re-export logging utilities
export { logger } from './src/utils/log.ts' 