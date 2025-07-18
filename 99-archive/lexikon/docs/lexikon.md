# Lexikon: A Modular LLM Development Toolkit

## Overview

Lexikon is a monorepo housing a collection of independent, focused modules for LLM application development. Each module is designed to be independently publishable to JSR (Deno's package registry) while maintaining the ability to work seamlessly together.

## Core Philosophy

1. **Independent Modules**: Each module does one thing and does it well
2. **Composable Design**: Modules can be used independently or together
3. **Consistent Patterns**: Similar structure and interfaces across modules
4. **Clear Boundaries**: Each module has a distinct responsibility
5. **Developer-First**: Easy to use, test, and maintain

## Module Structure

### Naming Convention

We use the `module-` prefix for all modules, making it clear these are reusable components rather than applications:

```
lexikon/
├── llm/           # Core LLM interface
├── prompt/        # Prompt management
└── modules/      # e.g., vector, cache, etc.
```

This naming convention:

- Clearly identifies reusable modules
- Distinguishes from applications
- Creates a consistent pattern
- Self-documents the purpose
- Works well with the `@lexikon` namespace

### Module Organization

Each module follows a consistent structure:

```
module-llm/
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

### Independence Principle

Each module maintains its own:
- Types and interfaces
- Utility functions
- Tests
- Documentation
- Configuration
- Version control

## JSR Publishing

### Module Configuration

Each module has its own `deno.json` for JSR publishing:

```json
{
  "name": "@lexikon/llm",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "tasks": {
    "test": "deno test --allow-env --allow-net",
    "test:debug": "deno test --allow-env --allow-net --env=LLM_LOG_LEVEL=debug",
    "test:cov": "deno test --allow-env --allow-net --coverage=coverage"
  },
  "publish": {
    "exclude": [
      "coverage/",
      "examples/",
      "tests/",
      ".github/",
      "*.test.ts",
      "*.md"
    ]
  }
}
```

### Import Maps

Applications can use the modules either through JSR or local development:

```json
// Using published versions
{
  "imports": {
    "@lexikon/llm": "jsr:@lexikon/llm@0.1.0"
  }
}

// Local development
{
  "imports": {
    "@lexikon/llm": "../llm/mod.ts"
  }
}
```

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

## Development Workflow

### Local Development

1. Clone the lexikon repository
2. Use import maps to point to local modules
3. Run tests and examples using local versions

### Publishing

1. Update module version in `deno.json`
2. Run tests and coverage checks
3. Publish to JSR using `deno publish`

## Future Modules

Potential future modules following the same pattern:

1. **vector**
   - Vector storage and operations
   - Embedding management
   - Similarity search

2. **cache**
   - LLM response caching
   - Token usage tracking
   - Cache invalidation

3. **eval**
   - Response evaluation
   - Quality metrics
   - Performance tracking

## Best Practices

### Module Development

1. **Independence**
   - No shared dependencies between modules
   - Each module maintains its own types
   - Clear module boundaries

2. **Documentation**
   - Comprehensive README
   - Usage examples
   - API documentation

3. **Testing**
   - High test coverage
   - Integration tests
   - Performance benchmarks

### Version Management

1. **Semantic Versioning**
   - Follow semver strictly
   - Document breaking changes
   - Maintain changelog

2. **Compatibility**
   - Clear minimum Deno version
   - Document dependencies
   - Migration guides

## Benefits

### For Developers

1. **Flexibility**
   - Use only what you need
   - Mix and match modules
   - Easy upgrades

2. **Maintainability**
   - Clear module boundaries
   - Independent versioning
   - Focused testing

3. **Development Experience**
   - Consistent interfaces
   - Clear documentation
   - Local development support

### For Contributors

1. **Clear Structure**
   - Consistent patterns
   - Independent modules
   - Focused responsibilities

2. **Easy Testing**
   - Isolated modules
   - Clear boundaries
   - Independent test suites

3. **Simple Publishing**
   - Independent versions
   - Clear release process
   - JSR integration

## Conclusion

The Lexikon toolkit provides a powerful, flexible approach to LLM application development. By maintaining independent, focused modules under a common namespace, we create a ecosystem that's easy to use, maintain, and extend while providing the flexibility developers need.
