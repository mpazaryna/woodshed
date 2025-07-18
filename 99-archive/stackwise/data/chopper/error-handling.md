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

## Error handling

### Guideline

#### Rule (name: Prioritize Error Handling)

- Handle errors and edge cases at the beginning of functions
- Use early returns for error conditions to avoid deeply nested if statements
- Place the happy path last in the function for improved readability
- Avoid unnecessary else statements; use the if-return pattern instead
- Use guard clauses to handle preconditions and invalid states early
- Implement proper error logging and user-friendly error messages
- Use custom error types or error factories for consistent error handling
