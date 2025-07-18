# Forge: A Modular LLM Development Toolkit

[![Deno](https://github.com/mpazaryna/forge/actions/workflows/deno.yml/badge.svg)](https://github.com/mpazaryna/forge/actions/workflows/deno.yml)

<img src="/assets/logo.jpeg" width="500" alt="Forge Logo">

## Background

Forge provides a lightweight, standardized interface for interacting with Large Language Models (LLMs), inspired by the simplicity and effectiveness of ODBC (Open Database Connectivity) drivers. Just as ODBC standardized database interactions across different systems, Forge aims to standardize LLM interactions while maintaining simplicity and flexibility.

## Rationale

The development of Forge was motivated by a common pattern in LLM application development: the repeated implementation of similar infrastructure code across projects. This pattern mirrors the historical challenge in database connectivity that ODBC solved.

### Historical Parallel

Just as applications in the 80s and 90s needed a standardized way to interact with different databases (leading to ODBC), today's applications need a standardized way to interact with different LLMs. The current landscape of LLM interactions often involves:

1. Writing boilerplate code for each provider
2. Managing different response formats
3. Handling context and prompts
4. Error handling and retry logic

While solutions like LangChain exist, they often provide more functionality than needed, leading to:

- Increased complexity
- Dependency bloat
- Reduced flexibility
- Higher learning curve
 
Forge aims to provide the minimal necessary abstraction layer, similar to how ODBC provided a simple, standard interface for database operations.

### Why Not LangChain?

While LangChain is a powerful framework, it often introduces unnecessary complexity for basic LLM interactions. Forge takes a different approach:

- **Simplicity First**: Focus on core LLM interactions without the overhead of chains and agents
- **Functional Design**: Pure functional approach rather than class-based architecture
- **Minimal Dependencies**: Lightweight implementation with essential features only
- **Standard Interface**: Consistent API across different LLM providers

## Module Structure

Forge is a monorepo housing a collection of independent, focused modules for LLM application development. Each module is designed to be independently publishable to JSR (Deno's package registry) while maintaining the ability to work seamlessly together.

### Core Philosophy

1. **Independent Modules**: Each module does one thing and does it well
2. **Composable Design**: Modules can be used independently or together
3. **Consistent Patterns**: Similar structure and interfaces across modules
4. **Clear Boundaries**: Each module has a distinct responsibility
5. **Developer-First**: Easy to use, test, and maintain

### Module Organization

Each module follows a consistent structure:

```ascii
llm/
├── mod.ts             # Main entry point
├── src/               # Source code
│   ├── clients/       # Module-specific implementations
│   ├── utils/         # Module-specific utilities
│   └── types.ts       # Module-specific types
├── tests/             # Module-specific tests
├── examples/          # Usage examples
├── README.md          # Module documentation
└── deno.json          # Module configuration
```

## Features

- Multiple LLM Provider Support:
  - Claude (Anthropic)
  - GPT-4 (OpenAI)
  - Mixtral (Groq)
- Context Management
- File Handling
- Response Processing
- Error Management

## Usage Examples

### Direct Module Usage

```typescript
// Using a single module
import { createLLMClient } from "@forge/llm";

const client = createLLMClient("claude", {
  apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
  model: "claude-3-sonnet-20240229"
});
```

### Composing Modules

```typescript
// Using multiple modules together
import { createLLMClient } from "@forge/llm";
import { PromptStack } from "@forger/prompt";

const prompt = new PromptStack()
  .addTemplate("system/base.md")
  .withVariables({ role: "assistant" });

const llm = createLLMClient("claude");
const response = await llm.complete({
  prompt: await prompt.compose()
});
```

## Project Structure

```ascii
forge/
├── llm/           # Core LLM interface
├── prompt/        # Prompt management
└── modules/       # e.g., vector, cache, etc.
```

