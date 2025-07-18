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

## Key conventions

### Convention

Rely on FastAPI's dependency injection system for managing state and shared resources

Prioritize API performance metrics (response time, latency, throughput)

#### #text

Limit blocking operations in routes: Favor asynchronous and non-blocking flows Use dedicated async functions for database and external API operations Structure routes and dependencies clearly to optimize readability and maintainability

#### Rule

- Favor asynchronous and non-blocking flows
- Use dedicated async functions for database and external API operations
- Structure routes and dependencies clearly to optimize readability and maintainability

Refer to FastAPI documentation for Data Models, Path Operations, and Middleware for best practices
