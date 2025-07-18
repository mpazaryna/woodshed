# Lexikon: A Modular LLM Development Toolkit

[![Deno](https://github.com/mpazaryna/lexikon/actions/workflows/deno.yml/badge.svg)](https://github.com/mpazaryna/lexikon/actions/workflows/deno.yml)

<img src="/assets/logo.jpeg" width="500" alt="Lexikon Logo">

## Portfolio Notice

**Important**: This repository is shared primarily as a portfolio piece and reference implementation. It represents tools I've built for my own development workflow and is not actively maintained for public use. While you're welcome to fork and use this code under the terms of the license, please note:

- This is not an actively maintained open source project
- I am not seeking contributions or feature requests
- Issues and pull requests will not be regularly monitored
- No guarantees of support or updates are provided

Feel free to use this as inspiration or reference for your own projects.

## Background

Lexikon provides a lightweight, standardized interface for interacting with Large Language Models (LLMs), inspired by the simplicity and effectiveness of ODBC (Open Database Connectivity) drivers. Just as ODBC standardized database interactions across different systems, Lexikon aims to standardize LLM interactions while maintaining simplicity and flexibility.

## Rationale

The development of Lexikon was motivated by a common pattern in LLM application development: the repeated implementation of similar infrastructure code across projects. This pattern mirrors the historical challenge in database connectivity that ODBC solved.

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

Lexikon aims to provide the minimal necessary abstraction layer, similar to how ODBC provided a simple, standard interface for database operations.

### Why Not LangChain?

While LangChain is a powerful framework, it often introduces unnecessary complexity for basic LLM interactions. Lexikon takes a different approach:

- **Simplicity First**: Focus on core LLM interactions without the overhead of chains and agents
- **Functional Design**: Pure functional approach rather than class-based architecture
- **Minimal Dependencies**: Lightweight implementation with essential features only
- **Standard Interface**: Consistent API across different LLM providers

## Module Structure

Lexikon is a monorepo housing a collection of independent, focused modules for LLM application development. Each module is designed to be independently publishable to JSR (Deno's package registry) while maintaining the ability to work seamlessly together.

### Core Philosophy

1. **Independent Modules**: Each module does one thing and does it well
2. **Composable Design**: Modules can be used independently or together
3. **Consistent Patterns**: Similar structure and interfaces across modules
4. **Clear Boundaries**: Each module has a distinct responsibility
5. **Developer-First**: Easy to use, test, and maintain

### Module Organization

Each module follows a consistent structure:

```
llm/
├── mod.ts              # Main entry point
├── src/               # Source code
│   ├── clients/       # Module-specific implementations
│   ├── utils/         # Module-specific utilities
│   └── types.ts       # Module-specific types
├── tests/             # Module-specific tests
├── examples/          # Usage examples
├── README.md          # Module documentation
└── deno.json         # Module configuration
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
import { createLLMClient } from "@lexikon/llm";

const client = createLLMClient("claude", {
  apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
  model: "claude-3-sonnet-20240229"
});
```

### Composing Modules

```typescript
// Using multiple modules together
import { createLLMClient } from "@lexikon/llm";
import { PromptStack } from "@lexikon/prompt";

const prompt = new PromptStack()
  .addTemplate("system/base.md")
  .withVariables({ role: "assistant" });

const llm = createLLMClient("claude");
const response = await llm.complete({
  prompt: await prompt.compose()
});
```

## Project Structure

```
lexikon/
├── llm/           # Core LLM interface
├── prompt/        # Prompt management
└── modules/       # e.g., vector, cache, etc.
```

## License

MIT License

Copyright (c) 2024 Matthew Pazaryna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
