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

## Performance optimization

### Guideline

Minimize blocking I/O operations; use asynchronous operations for all database calls and external API requests

Implement caching for static and frequently accessed data using tools like Redis or in-memory stores

Optimize data serialization and deserialization with Pydantic

Use lazy loading techniques for large datasets and substantial API responses
