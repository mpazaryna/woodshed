# Flywheel Prompting

Add the concept into the create.json and indicate what domain to use.

```bash
deno run --allow-read --allow-write --allow-env src/create.ts
deno run --allow-read --allow-write --allow-env src/eval.ts three-act d846043c-three-act advanced
deno run --allow-read --allow-write --allow-env src/improve.ts three-act d846043c-three-act true 95 5 all
```

## Story Parser

Generate a GraphQL representation

```bash
deno run --allow-read --allow-write src/story_to_graphql.ts -d ed4a0e5d-hero-analyst 
```

## Production Analysis

```bash
deno run --allow-read --allow-write --allow-env src/production_analysis.ts 8d05bf5a-harmon-circle
```

## Script Analysis

```bash
deno run --allow-read --allow-write --allow-env src/analyze.ts
```
