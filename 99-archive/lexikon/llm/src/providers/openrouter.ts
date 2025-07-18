import type { Provider, CompletionParams, CompletionResponse, CompletionChunk } from "../shared/interfaces/provider.ts";

export interface OpenRouterConfig {
  apiKey: string;
  baseUrl?: string;
}

export function createOpenRouterProvider(config: OpenRouterConfig): Provider {
  const baseUrl = config.baseUrl || "https://openrouter.ai/api/v1";
  const systemPrompt = "You are a helpful AI assistant. Provide clear, well-formatted responses. Always use proper punctuation and complete sentences.";

  async function complete(params: CompletionParams): Promise<CompletionResponse> {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/cursor-ai",
        "X-Title": "Cursor AI Module"
      },
      body: JSON.stringify({
        model: params.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: params.prompt }
        ],
        temperature: params.temperature,
        max_tokens: params.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      usage: data.usage,
    };
  }

  async function* streamComplete(params: CompletionParams): AsyncIterableIterator<CompletionChunk> {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/cursor-ai",
        "X-Title": "Cursor AI Module"
      },
      body: JSON.stringify({
        model: params.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: params.prompt }
        ],
        temperature: params.temperature,
        max_tokens: params.maxTokens,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Add new data to buffer and split into lines
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Process all complete lines
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          if (line.startsWith('data: ')) {
            const content = line.slice(6);
            if (content === '[DONE]') continue;
            
            try {
              const data = JSON.parse(content);
              if (data.choices?.[0]?.delta?.content) {
                yield {
                  text: data.choices[0].delta.content,
                  usage: data.usage,
                };
              }
            } catch (_error) {
              // Skip invalid JSON
              console.debug('Skipping invalid JSON in stream', { line });
            }
          }
        }
        
        // Keep the last partial line in the buffer
        buffer = lines[lines.length - 1];
      }
      
      // Process any remaining complete data in the buffer
      if (buffer.trim()) {
        const line = buffer.trim();
        if (line.startsWith('data: ')) {
          const content = line.slice(6);
          if (content !== '[DONE]') {
            try {
              const data = JSON.parse(content);
              if (data.choices?.[0]?.delta?.content) {
                yield {
                  text: data.choices[0].delta.content,
                  usage: data.usage,
                };
              }
            } catch (_error) {
              // Skip invalid JSON
              console.debug('Skipping invalid JSON in final buffer:', line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  function validateConfig(cfg: OpenRouterConfig): void {
    if (!cfg.apiKey) {
      throw new Error("API key is required");
    }
  }

  function initialize(): Promise<void> {
    return Promise.resolve();
  }

  async function handleRateLimiting(): Promise<void> {
    // Implement rate limiting logic if needed
  }

  return {
    id: "openrouter",
    config,
    complete,
    streamComplete,
    initialize,
    validateConfig,
    handleRateLimiting,
  };
} 