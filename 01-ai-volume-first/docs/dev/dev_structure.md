# Woodshed Repository Structure

## Overview

This document outlines the organization of the woodshed AI coding monorepo, designed to accommodate:

- Reusable modules that could be extracted into separate projects
- Integration code for various AI providers and frameworks
- Experimental code and prototypes

## Directory Structure

```sh
woodshed/
├── modules/           # Extractable, reusable components
│   ├── pdf_chat/
│   └── scrape_wikipedia/
├── integrations/      # Provider & framework specific implementations
│   ├── providers/     # API/service specific code
│   │   ├── groq/
│   │   └── anthropic/
│   └── frameworks/    # Framework-specific code
│       ├── langchain/
│       └── llamaindex/
├── labs/             # Experimental code & prototypes
└── tests/            # Top-level tests
```

## Directory Purposes

### modules/

- Contains well-defined, potentially extractable components
- Each module could become its own repository/package
- Should include:
  - Own setup.py or pyproject.toml
  - Clear documentation
  - Tests
  - Minimal dependencies on other parts of the monorepo

### integrations/

- Houses implementation-specific code that isn't quite experimental but also isn't modular enough to be extracted
- Divided into:
  - `providers/`: For provider-specific implementations (e.g., Groq CLI, Anthropic utilities)
  - `frameworks/`: For framework-specific code (e.g., LangChain utilities)
- Each integration can have its own tests and documentation

### labs/

- Space for experimental code and prototypes
- Maintains testability while allowing for exploration
- Ideal for proof-of-concepts and prototypes
- Can be used to test new ideas before moving them to modules or integrations

### tests/

- Top-level tests that span multiple components
- Each subdirectory can also contain its own tests

## Migration Path

When code in `labs/` or `integrations/` matures:

1. If it's generally reusable, move it to `modules/`
2. If it's specific to a provider/framework but stable, keep it in `integrations/`
3. If it's still experimental, keep it in `labs/`

## Testing

- All code remains testable regardless of location
- Each directory can contain its own tests
- Use pytest for consistency across the repository