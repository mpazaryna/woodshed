import { 
  type LLMClient, 
  type Message, 
  type Completion, 
  type CompletionChunk,
  type LLMConfig, 
  LLMError, 
  type GeminiModel 
} from '../types.ts'
import { logger } from '../utils/log.ts'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models'

const DEFAULT_GEMINI_MODEL: GeminiModel = 'gemini-pro'

const SUPPORTED_GEMINI_MODELS: Set<GeminiModel> = new Set([
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash'
])

interface GeminiMessage {
  role: string
  parts: Array<{ text: string }>
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>
      role: string
    }
  }>
  usageMetadata: {
    promptTokenCount: number
    candidatesTokenCount: number
  }
}

interface GeminiStreamChunk {
  candidates?: Array<{
    content: {
      parts: Array<{ text: string }>
      role: string
    }
    finishReason?: string
  }>
  promptFeedback?: {
    promptTokenCount: number
  }
}

export function createGeminiClient(config: LLMConfig): LLMClient {
  // Validate model if provided
  if (config.model && !SUPPORTED_GEMINI_MODELS.has(config.model as GeminiModel)) {
    const error = `Unsupported Gemini model: ${config.model}. Supported models are: ${Array.from(SUPPORTED_GEMINI_MODELS).join(', ')}`
    logger.error(error, { model: config.model })
    throw new LLMError(error, 'gemini')
  }

  const model = config.model || DEFAULT_GEMINI_MODEL
  logger.info('Creating Gemini client', { model, maxTokens: config.maxTokens })

  const headers = {
    'Content-Type': 'application/json',
  }

  return {
    async complete(messages: Message[]): Promise<Completion> {
      try {
        logger.debug('Sending request to Gemini API', {
          model,
          messageCount: messages.length,
          maxTokens: config.maxTokens,
          temperature: config.temperature,
        })

        const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent?key=${config.apiKey}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contents: messages.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }],
            })),
            generationConfig: {
              maxOutputTokens: config.maxTokens,
              temperature: config.temperature,
            },
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const error = `Gemini API error: ${response.statusText}${
            errorData.error?.message ? ` - ${errorData.error.message}` : ''
          }`
          logger.error(error, { 
            status: response.status,
            statusText: response.statusText,
            error: errorData.error
          })
          throw new LLMError(error, 'gemini', response.status)
        }

        const data = await response.json() as GeminiResponse

        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const error = 'Invalid response format from Gemini API'
          logger.error(error, { response: data })
          throw new LLMError(error, 'gemini')
        }

        logger.debug('Received response from Gemini API', {
          promptTokens: data.usageMetadata.promptTokenCount,
          completionTokens: data.usageMetadata.candidatesTokenCount,
        })

        return {
          message: {
            role: 'assistant',
            content: data.candidates[0].content.parts[0].text,
          },
          usage: {
            promptTokens: data.usageMetadata.promptTokenCount,
            completionTokens: data.usageMetadata.candidatesTokenCount,
            totalTokens: 
              data.usageMetadata.promptTokenCount + 
              data.usageMetadata.candidatesTokenCount,
          },
        }
      } catch (error) {
        if (error instanceof LLMError) {
          throw error
        }
        
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'An unknown error occurred'
        
        logger.error(`Unexpected error: ${errorMessage}`, {
          error: error instanceof Error ? error.stack : undefined,
        })
          
        throw new LLMError(
          `Unexpected error: ${errorMessage}`,
          'gemini',
        )
      }
    },

    async *completeStream(messages: Message[]): AsyncIterableIterator<CompletionChunk> {
      try {
        logger.debug('Sending streaming request to Gemini API', {
          model,
          messageCount: messages.length,
          maxTokens: config.maxTokens,
          temperature: config.temperature,
        })

        const response = await fetch(`${GEMINI_API_URL}/${model}:streamGenerateContent?key=${config.apiKey}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contents: messages.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }],
            })),
            generationConfig: {
              maxOutputTokens: config.maxTokens,
              temperature: config.temperature,
            },
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const error = `Gemini API error: ${response.statusText}${
            errorData.error?.message ? ` - ${errorData.error.message}` : ''
          }`
          logger.error(error, { 
            status: response.status,
            statusText: response.statusText,
            error: errorData.error
          })
          throw new LLMError(error, 'gemini', response.status)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new LLMError('No response body available', 'gemini')
        }

        const decoder = new TextDecoder()
        let accumulatedContent = ''
        let promptTokens = 0

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter(line => line.trim())

            for (const line of lines) {
              try {
                const data = JSON.parse(line) as GeminiStreamChunk

                // Update prompt tokens if available
                if (data.promptFeedback?.promptTokenCount) {
                  promptTokens = data.promptFeedback.promptTokenCount
                }

                // Process content if available
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                  const text = data.candidates[0].content.parts[0].text
                  accumulatedContent += text

                  yield {
                    message: {
                      role: 'assistant',
                      content: text,
                    },
                  }

                  // If this is the final chunk (has finishReason), include token usage
                  if (data.candidates[0].finishReason) {
                    const completionTokens = Math.ceil(accumulatedContent.length / 4) // Rough estimate
                    yield {
                      message: {
                        role: 'assistant',
                        content: accumulatedContent,
                      },
                      usage: {
                        promptTokens,
                        completionTokens,
                        totalTokens: promptTokens + completionTokens,
                      },
                    }
                  }
                }
              } catch (_e) {
                // Skip invalid JSON
                logger.debug('Skipping invalid JSON in stream', { line })
              }
            }
          }
        } finally {
          reader.releaseLock()
        }

      } catch (error) {
        if (error instanceof LLMError) {
          throw error
        }
        
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'An unknown error occurred'
        
        logger.error(`Unexpected error in stream: ${errorMessage}`, {
          error: error instanceof Error ? error.stack : undefined,
        })
          
        throw new LLMError(
          `Unexpected error in stream: ${errorMessage}`,
          'gemini',
        )
      }
    },
  }
} 