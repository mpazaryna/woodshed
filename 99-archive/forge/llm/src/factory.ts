import { type CreateLLMClient, type LLMConfig, LLMError, type ModelProvider } from './types.ts'
import { createClaudeClient } from './clients/claude.ts'
import { createGeminiClient } from './clients/gemini.ts'
import { getApiKey } from './utils/env.ts'

/**
 * Create an LLM client for the specified provider
 */
export const createLLMClient: CreateLLMClient = (
  provider: ModelProvider,
  config: LLMConfig,
) => {
  // First validate the provided API key if any
  if (config.apiKey !== undefined && !config.apiKey.trim()) {
    throw new Error('API key is required')
  }

  // If no API key in config, try environment
  const apiKey = config.apiKey || getApiKey(provider)
  const clientConfig = { ...config, apiKey }

  switch (provider) {
    case 'claude':
      return createClaudeClient(clientConfig)
    case 'gemini':
      return createGeminiClient(clientConfig)
    case 'openai':
      throw new LLMError(
        `Provider ${provider} is not yet implemented`,
        provider,
      )
    default:
      throw new LLMError(
        `Unknown provider: ${provider}`,
        provider,
      )
  }
} 