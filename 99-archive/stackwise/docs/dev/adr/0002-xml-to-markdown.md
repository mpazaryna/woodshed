# ADR 0002: Migrate from XML to Markdown for Context Templates

Date: 2025-01-08

## Status

Completed

## Context

Our context generation system currently uses XML for template definitions. While XML provides structure, we've identified several challenges:

- Verbose syntax increases template complexity
- Limited readability for content-heavy templates
- Overhead in parsing and maintaining XML schema
- Difficulty in quick template modifications
- Steep learning curve for content authors

We need a format that:

- Supports modular content composition
- Maintains structural clarity
- Enables easy content authoring
- Provides programmatic accessibility
- Facilitates version control

## Decision

We will migrate context templates from XML to Markdown with YAML frontmatter because:

1. Markdown provides:
   - Human-readable format
   - Simple syntax for content authors
   - Native support in many tools
   - Easy version control diff viewing

2. YAML frontmatter enables:
   - Structured metadata
   - Template properties
   - Composition instructions

Example structure:

```markdown
---
template: hero-journey
version: 1.0
tags:
  - narrative
  - story-structure
dependencies:
  - character-arc
  - world-building
---

# Hero's Journey Template

## Core Elements

1. Character Development
2. Plot Structure
3. World Building

[Content sections...]
```

## Consequences

### Positive

1. Improved Content Management
   - Easier content authoring
   - Better readability
   - Simpler version control
   - Faster template iterations

2. Enhanced Modularity
   - Clear dependency management
   - Simplified content composition
   - Better template reuse

3. Reduced Complexity
   - Simpler parsing logic
   - Fewer validation requirements
   - Lower maintenance overhead

### Negative

1. Migration Effort
   - Need to convert existing templates
   - Update parsing infrastructure
   - Modify composition logic

2. Less Rigid Structure
   - Reduced validation capabilities
   - More flexibility in formatting
   - Potential consistency challenges

### Required Changes

1. Create new template structure:
   - Define frontmatter schema
   - Establish markdown conventions
   - Document composition patterns

2. Build processing pipeline:
   - YAML frontmatter parser
   - Markdown processor
   - Template composer

3. Develop migration tools:
   - XML to MD converter
   - Validation suite
   - Testing framework

### Best Practices

1. Template Design
   - Clear section hierarchy
   - Consistent formatting
   - Explicit dependencies

2. Content Management
   - Version control guidelines
   - Review process
   - Documentation standards
