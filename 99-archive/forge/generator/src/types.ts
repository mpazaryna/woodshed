/**
 * Core types for template generation
 */
export interface GeneratorConfig {
  llm: LLMClient;
  retryOptions?: RetryOptions;
  transforms?: Array<(content: string) => string>;
}

export interface GeneratorContext {
  [key: string]: unknown;
}

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  onError?: (error: Error, attempt: number) => void;
  onRetry?: (attempt: number, delay: number) => void;
}

export interface GenerationResult {
  content: string;
  metadata: {
    generatedAt: Date;
    templateId?: string;
    attempts?: number;
  };
}

export interface TemplateGenerator {
  loadTemplate(templatePath: string): Promise<TemplateGenerator>;
  withContext(ctx: GeneratorContext): TemplateGenerator;
  generate(): Promise<GenerationResult>;
}

export interface LLMClient {
  complete(messages: Array<{ role: string; content: string }>): Promise<{
    message?: { content: string };
  }>;
} 