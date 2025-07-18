// Environment variable utilities
import type { ModelProvider } from '../types.ts';

/**
 * Get an environment variable or throw if it's not set
 */
export function getRequiredEnvVar(name: string): string {
  const value = Deno.env.get(name)
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`)
  }
  return value
}

/**
 * Get an environment variable or return a default value
 */
export function getEnvVar(name: string, defaultValue: string): string {
  return Deno.env.get(name) ?? defaultValue
}

/**
 * Get API keys for different providers from environment variables
 */
export function getApiKey(provider: ModelProvider): string {
  const envVarMap = {
    claude: 'ANTHROPIC_API_KEY',
    gemini: 'GOOGLE_API_KEY',
    openai: 'OPENAI_API_KEY',
  }

  return getRequiredEnvVar(envVarMap[provider])
} 