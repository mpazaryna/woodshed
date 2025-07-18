# Module LLM Examples

This directory contains examples demonstrating how to use the Module LLM library.

## Running the Examples

To run any example, use the Deno CLI with the necessary permissions. For instance:

```bash
# Run the simple chat example
deno run --allow-env --allow-net examples/claude_chat.ts

# Run the longer form example (with token usage info)
deno run --allow-env --allow-net examples/claude_streaming.ts
```

Make sure you have the required API keys set in your environment variables before running the examples:

- For Claude: `ANTHROPIC_API_KEY`
- For Gemini: `GOOGLE_API_KEY`

## Available Examples

### simple_chat.ts

A basic example showing how to:

- Create an LLM client
- Send a simple prompt
- Handle the response

This example uses Claude, but can be easily modified to use other supported models.

### simple_streaming.ts

A more detailed example that demonstrates:

- Handling longer form content generation
- Working with the completion interface
- Accessing token usage information

Note: True streaming support is planned for future releases of the module. This example currently uses the standard completion interface.
