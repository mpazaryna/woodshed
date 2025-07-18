# Combined Rules for Copilot
# Generated on Thu Jun  5 09:49:39 EDT 2025

## From: google-adk.md

# Shared Rules - Google Agent Development Kit

## Python & Environment Management

**Use uv for dependency management**
- Always use `uv` instead of pip for package installation and virtual environment management
- Keep `pyproject.toml` updated with all dependencies and their versions
- Use `uv sync` to ensure consistent environments across development setups

**Python version consistency**
- Target Python 3.11+ for all agent development
- Specify Python version in `pyproject.toml` under `[tool.uv]`

## Code Structure & Organization

**Agent module structure**
```
agents/
├── __init__.py
├── base/
│   ├── agent.py          # Base agent class
│   └── exceptions.py     # Custom exceptions
├── tools/
│   ├── __init__.py
│   └── [tool_modules]/   # Individual tool implementations
└── config/
    └── settings.py       # Agent configuration
```

**Import conventions**
- Use absolute imports for agent modules: `from agents.base.agent import BaseAgent`
- Group imports: standard library → third-party → local modules
- Use `from google.cloud import agent_sdk` for Google Agent SDK imports

## Error Handling & Logging

**Exception handling**
- Always wrap agent operations in try-except blocks
- Use custom exceptions from `agents.base.exceptions`
- Include context in error messages for debugging

**Logging standards**
- Use structured logging with `structlog` or Python's `logging`
- Include agent_id, request_id, and timestamp in all log entries
- Log levels: DEBUG for development, INFO for agent actions, ERROR for failures

## Testing Requirements

**Test organization**
- Place tests in `tests/` directory mirroring the `agents/` structure
- Use pytest for all testing
- Mock external API calls and Google Cloud services

**Coverage expectations**
- Maintain >80% test coverage for agent logic
- Include integration tests for agent workflows
- Test error scenarios and edge cases

# Refactoring Guidelines

These guidelines are to be used when generating refactoring suggestions or when responding to refactoring-related requests.

## Core Principles

-   Fowler's "Refactoring" (2nd Edition): All refactoring recommendations should be grounded in the patterns and principles described by Martin Fowler in his book "Refactoring: Improving the Design of Existing Code" (2nd Edition).
-   Preserve Behavior: The primary goal of refactoring is to improve the internal structure of the code without changing its external behavior. Refactorings should maintain existing functionality.
-   Small Steps: Favor small, incremental refactoring steps over large, sweeping changes. Each step should be testable and easily reversible.
-   Test Driven: Refactoring is only safe if there are good tests. Test coverage is required before refactoring.

## When Suggesting a Refactor

-   Identify the Smell: Clearly articulate the code smell or design issue that motivates the refactoring. (e.g., "Long Method," "Duplicate Code," "Feature Envy," etc.) using terminology from Fowler's book.
-   Propose a Refactoring: Suggest a specific refactoring technique from Fowler's catalog. (e.g., "Extract Method," "Move Method," "Introduce Parameter Object," etc.)
-   Explain the Rationale: Provide a concise explanation of why this refactoring is beneficial in this context. Explain how it addresses the identified code smell and improves the code's design.
-   Outline the Steps: Briefly describe the key steps involved in performing the refactoring.
-   Preserve Tests: make sure the proposed refactoring also include updating or adding tests as needed.
-   Be explicit about which part of the code needs refactoring: Don't suggest refactoring for the entire file or method. be specific.

## Example Response Structure

-   This code exhibits the 'Long Method' code smell because [explain why]. To address this, I recommend using the 'Extract Method' refactoring. This involves moving a logically cohesive block of code into a new method, which will improve readability and maintainability. The steps would be: 1) [step 1], 2) [step 2], etc. We should also add a new unit test for the extracted method.

## Things to Avoid

-   Changing Functionality: Refactoring is not the time to add new features or fix bugs.
-   Over-Engineering: Avoid introducing overly complex solutions. Favor simplicity and clarity.
-   Unnecessary Refactoring: Don't refactor for the sake of refactoring. There should always be a clear benefit.

## Notes

-   The user is aware of these guidelines, so the refactoring suggestions should assume that and provide clear direction and not waste words on definitions.
-   When giving code suggestions it should be small and focused on only what is being refactored.
