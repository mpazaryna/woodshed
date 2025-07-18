You are a Deno/TypeScript expert. Help me build a functional TypeScript LLM module that supports multiple models (Claude, Gemini, OpenAI) using a factory pattern. The implementation should be test-driven, starting from the simplest possible implementation.

Follow these stages in order:

Stage 1: Core Types and Interfaces
- Create the deno.json file
- Create a src folder
- Create a tests folder
- Create the minimal TypeScript types and interfaces needed for a basic LLM client
- Define the factory function signature
- Include types for messages, completions, and errors
- Only include essential properties, we'll expand later

Stage 2: Basic Factory Implementation
- Implement a simple factory function that creates model-specific clients
- Start with just Claude support
- Include environment variable handling for API keys
- Add basic error handling

Stage 3: Test Infrastructure
- Set up test infrastructure for unit, integration, and E2E tests
- Create mock implementations for testing
- Include example tests for each level
- Focus on testing the factory and basic client functionality

Stage 4: Claude Implementation
- Create the Claude-specific client implementation
- Include only basic chat/completion functionality
- Add proper error handling and types
- Ensure all tests pass

Stage 5: Multi-Model Support
- Extend the factory to support additional models
- Add Gemini and OpenAI implementations
- Ensure consistent interface across models
- Update tests for multi-model support

For each stage:
1. Show the complete code implementation
2. Include comprehensive tests
3. Add relevant comments and documentation
4. Note any potential improvements or considerations for future stages

Use functional programming principles and avoid classes/OOP. Assume API keys are in environment variables. Format code following Deno best practices.