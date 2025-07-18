---
name: fastapi-python-cursor-rules
id: fastapi-python-cursor-rules-5vow08
description: 
category: Uncategorized
author: system@cursor.directory
created: 2024-11-13T23:17:49.545Z
modified: 2024-11-13T23:17:49.545Z
tags: ["FastAPI", "Python"]
---

# fastapi-python-cursor-rules

## Principle python fastapi

### Rule (name: Python/FastAPI)

- Use def for pure functions and async def for asynchronous operations
- Use type hints for all function signatures
- Prefer Pydantic models over raw dictionaries for input validation
- File structure: exported router, sub-routes, utilities, static content, types (models, schemas)
- Avoid unnecessary curly braces in conditional statements
- For single-line statements in conditionals, omit curly braces
- Use concise, one-line syntax for simple conditional statements (e.g., if condition: do_something())
