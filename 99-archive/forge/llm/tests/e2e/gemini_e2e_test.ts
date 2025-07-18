import { assert, assertEquals, assertRejects } from 'std/assert/mod.ts'
import { createLLMClient } from '@forge/llm'
import { LLMError, type GeminiModel } from '@forge/llm'

// Helper to add delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// E2E tests - testing complete flow with real API
Deno.test({
  name: 'e2e: gemini complete flow',
  ignore: !Deno.env.get('GOOGLE_API_KEY'),
  async fn(t) {
    const defaultClient = createLLMClient('gemini', {
      apiKey: Deno.env.get('GOOGLE_API_KEY') || '',
      temperature: 0,
      maxTokens: 100,
    })

    await t.step('simple completion with default model', async () => {
      const result = await defaultClient.complete([
        {
          role: 'user',
          content: 'What is 2+2? Reply with just the number.',
        },
      ])

      assertEquals(result.message.role, 'assistant')
      assert(result.message.content.includes('4'))
      assert(result.usage.totalTokens > 0)
      
      // Add delay after API call
      await delay(1000)
    })

    // Test different Gemini models
    const modelsToTest: GeminiModel[] = [
      'gemini-1.5-pro',
      'gemini-1.5-flash'
    ]

    for (const model of modelsToTest) {
      await t.step(`completion with ${model}`, async () => {
        const client = createLLMClient('gemini', {
          apiKey: Deno.env.get('GOOGLE_API_KEY') || '',
          model,
          temperature: 0,
          maxTokens: 100,
        })

        const result = await client.complete([
          {
            role: 'user',
            content: 'What is 2+2? Reply with just the number.',
          },
        ])

        assertEquals(result.message.role, 'assistant')
        assert(result.message.content.includes('4'))
        assert(result.usage.totalTokens > 0)
        
        // Add delay after API call
        await delay(1000)
      })
    }

    await t.step('error handling with invalid model', async () => {
      await assertRejects(
        async () => {
          const client = createLLMClient('gemini', {
            apiKey: Deno.env.get('GOOGLE_API_KEY') || '',
            model: 'invalid-model',
          });
          await client.complete([{ role: 'user', content: 'test' }]);
        },
        LLMError,
        'Unsupported Gemini model'
      )
    })

    await t.step('error handling with invalid API key', async () => {
      const badClient = createLLMClient('gemini', {
        apiKey: 'invalid-key',
      })

      await assertRejects(
        async () => {
          await badClient.complete([{ role: 'user', content: 'test' }])
        },
        LLMError,
        'Gemini API error'
      )
      
      // Add delay after API call
      await delay(1000)
    })
  },
}) 