# Module Template Generator

A functional template-based content generation module that implements the Builder pattern with a fluent interface for generating content using Large Language Models (LLMs).

## Architecture

This module implements two key patterns:
1. **Builder Pattern**: Constructs complex content generation through a step-by-step process
2. **Fluent Interface**: Provides a chainable API for a more readable and maintainable code

### Core Components

- **Template**: Source template with placeholders
- **Context**: Data to inject into template
- **Generator**: Core builder that manages the generation process
- **LLM**: Language model integration for content generation

## Features

- **Fluent Builder API**: Chain methods for intuitive content generation
- **Template Management**: Load and process templates with placeholder substitution
- **Context Injection**: Inject data into templates before LLM processing
- **Error Handling**: Built-in retry mechanism for LLM calls
- **Extensible**: Support for custom transforms and LLM providers
- **Type Safety**: Full TypeScript support with clear interfaces

## Core Types
