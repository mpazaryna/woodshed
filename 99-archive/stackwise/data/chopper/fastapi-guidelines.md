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

## Fastapi guidelines

### Guideline

Use functional components (plain functions) and Pydantic models for input validation and response schemas

Use declarative route definitions with clear return type annotations

Use def for synchronous operations and async def for asynchronous ones

Minimize @app.on_event("startup") and @app.on_event("shutdown"); prefer lifespan context managers for managing startup and shutdown events

Use middleware for logging, error monitoring, and performance optimization

Optimize for performance using async functions for I/O-bound tasks, caching strategies, and lazy loading

Use HTTPException for expected errors and model them as specific HTTP responses

Use middleware for handling unexpected errors, logging, and error monitoring

Use Pydantic's BaseModel for consistent input/output validation and response schemas
