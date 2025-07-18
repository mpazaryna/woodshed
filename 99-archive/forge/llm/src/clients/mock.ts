import type { LLMClient, Message, Completion, CompletionChunk, LLMConfig } from '../types.ts'

export interface MockConfig extends LLMConfig {
  mockResponses?: Array<{
    message: string
    tokens?: {
      prompt: number
      completion: number
    }
  }>
  delay?: number
  shouldFail?: boolean
}

export function createMockClient(config: MockConfig): LLMClient {
  let responseIndex = 0
  const responses = config.mockResponses ?? [
    {
      message: 'This is a mock response',
      tokens: { prompt: 10, completion: 5 },
    },
  ]

  return {
    async complete(messages: Message[]): Promise<Completion> {
      if (config.delay) {
        await new Promise((resolve) => setTimeout(resolve, config.delay))
      }

      if (config.shouldFail) {
        throw new Error('Mock client error')
      }

      const response = responses[responseIndex % responses.length]
      responseIndex++

      const tokens = response.tokens ?? {
        prompt: messages.reduce((acc, msg) => acc + msg.content.length, 0),
        completion: response.message.length,
      }

      return {
        message: {
          role: 'assistant',
          content: response.message,
        },
        usage: {
          promptTokens: tokens.prompt,
          completionTokens: tokens.completion,
          totalTokens: tokens.prompt + tokens.completion,
        },
      }
    },

    async *completeStream(messages: Message[]): AsyncIterableIterator<CompletionChunk> {
      if (config.delay) {
        await new Promise((resolve) => setTimeout(resolve, config.delay))
      }

      if (config.shouldFail) {
        throw new Error('Mock client error')
      }

      const response = responses[responseIndex % responses.length]
      responseIndex++

      const tokens = response.tokens ?? {
        prompt: messages.reduce((acc, msg) => acc + msg.content.length, 0),
        completion: response.message.length,
      }

      // Split response into chunks
      const chunks = response.message.split(' ')
      let accumulatedContent = ''

      for (const chunk of chunks) {
        accumulatedContent += chunk + ' '
        yield {
          message: {
            role: 'assistant',
            content: chunk + ' ',
          },
        }
      }

      // Final chunk with complete content and usage
      yield {
        message: {
          role: 'assistant',
          content: accumulatedContent.trim(),
        },
        usage: {
          promptTokens: tokens.prompt,
          completionTokens: tokens.completion,
          totalTokens: tokens.prompt + tokens.completion,
        },
      }
    },
  }
} 