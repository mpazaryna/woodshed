import { 
  type LLMClient, 
  type Message, 
  type Completion, 
  type CompletionChunk,
  type LLMConfig, 
  LLMError, 
  type ClaudeModel 
} from '../types.ts'
import { logger } from '../utils/log.ts'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

const DEFAULT_CLAUDE_MODEL: ClaudeModel = 'claude-3-sonnet-20240229'

const SUPPORTED_CLAUDE_MODELS: Set<ClaudeModel> = new Set([
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'claude-2.1',
  'claude-2.0',
])

export interface ClaudeMessage {
  role: string
  content: string
}

interface ClaudeResponse {
  content: Array<{ text: string, type: string }>
  role: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

interface ClaudeStreamChunk {
  type: 'content_block_delta' | 'message_stop'
  delta?: {
    type: string
    text: string
  }
  usage?: {
    input_tokens: number
    output_tokens: number
  }
}

export function createClaudeClient(config: LLMConfig): LLMClient {
  // Validate model if provided
  if (config.model && !SUPPORTED_CLAUDE_MODELS.has(config.model as ClaudeModel)) {
    const error = `Unsupported Claude model: ${config.model}. Supported models are: ${Array.from(SUPPORTED_CLAUDE_MODELS).join(', ')}`
    logger.error(error, { model: config.model })
    throw new LLMError(error, 'claude')
  }

  const model = config.model || DEFAULT_CLAUDE_MODEL
  logger.info('Creating Claude client', { model, maxTokens: config.maxTokens })

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': config.apiKey,
    'anthropic-version': '2023-06-01',
  }

  return {
    async complete(messages: Message[]): Promise<Completion> {
      try {
        const systemMessage = messages.find(m => m.role === 'system')?.content
        
        logger.debug('Sending request to Claude API', {
          model,
          messageCount: messages.length,
          hasSystemMessage: !!systemMessage,
          maxTokens: config.maxTokens,
          temperature: config.temperature,
        })

        const response = await fetch(CLAUDE_API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model,
            messages: messages
              .filter(msg => msg.role !== 'system')
              .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content,
              })),
            max_tokens: config.maxTokens || 1024,
            temperature: config.temperature ?? 0.7,
            system: systemMessage,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const error = `Claude API error: ${response.statusText}${
            errorData.error?.message ? ` - ${errorData.error.message}` : ''
          }`
          logger.error(error, { 
            status: response.status,
            statusText: response.statusText,
            error: errorData.error
          })
          throw new LLMError(error, 'claude', response.status)
        }

        const data = await response.json() as ClaudeResponse

        logger.debug('Received response from Claude API', {
          role: data.role,
          inputTokens: data.usage.input_tokens,
          outputTokens: data.usage.output_tokens,
        })

        return {
          message: {
            role: 'assistant',
            content: data.content[0].text,
          },
          usage: {
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens: data.usage.input_tokens + data.usage.output_tokens,
          },
        }
      } catch (error: unknown) {
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
          'claude',
        )
      }
    },

    async *completeStream(messages: Message[]): AsyncIterableIterator<CompletionChunk> {
      try {
        const systemMessage = messages.find(m => m.role === 'system')?.content
        
        logger.debug('Sending streaming request to Claude API', {
          model,
          messageCount: messages.length,
          hasSystemMessage: !!systemMessage,
          maxTokens: config.maxTokens,
          temperature: config.temperature,
        })

        const response = await fetch(CLAUDE_API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model,
            messages: messages
              .filter(msg => msg.role !== 'system')
              .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content,
              })),
            max_tokens: config.maxTokens || 1024,
            temperature: config.temperature ?? 0.7,
            system: systemMessage,
            stream: true,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const error = `Claude API error: ${response.statusText}${
            errorData.error?.message ? ` - ${errorData.error.message}` : ''
          }`
          logger.error(error, { 
            status: response.status,
            statusText: response.statusText,
            error: errorData.error
          })
          throw new LLMError(error, 'claude', response.status)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new LLMError('No response body available', 'claude')
        }

        const decoder = new TextDecoder()
        let accumulatedContent = ''
        let finalUsage: ClaudeResponse['usage'] | undefined

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter(line => line.trim())

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue

                try {
                  const parsed = JSON.parse(data) as ClaudeStreamChunk
                  
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    accumulatedContent += parsed.delta.text
                    yield {
                      message: {
                        role: 'assistant',
                        content: parsed.delta.text,
                      },
                      // Include usage if available in the chunk
                      ...(parsed.usage && {
                        usage: {
                          promptTokens: parsed.usage.input_tokens,
                          completionTokens: parsed.usage.output_tokens,
                          totalTokens: parsed.usage.input_tokens + parsed.usage.output_tokens,
                        },
                      }),
                    }
                  } else if (parsed.type === 'message_stop' && parsed.usage) {
                    finalUsage = parsed.usage
                  }
                } catch (_e) {
                  // Skip invalid JSON
                  logger.debug('Skipping invalid JSON in stream', { line })
                }
              }
            }
          }
        } finally {
          reader.releaseLock()
        }

        // Yield final chunk with complete content and usage
        if (finalUsage) {
          yield {
            message: {
              role: 'assistant',
              content: accumulatedContent,
            },
            usage: {
              promptTokens: finalUsage.input_tokens,
              completionTokens: finalUsage.output_tokens,
              totalTokens: finalUsage.input_tokens + finalUsage.output_tokens,
            },
          }
        }

      } catch (error: unknown) {
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
          'claude',
        )
      }
    },
  }
} 