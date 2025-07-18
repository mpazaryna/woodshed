# Codex

To run prettier from mac: option-shift-f

A modern article reading and archival tool built with Deno, showcasing the synthesis of AI-assisted development with systematic code refinement.

## Features

- Article fetching from multiple sources (Medium, arXiv, NYTimes)
- Markdown conversion for consistent reading experience
- Local article archival
- Clean, maintainable architecture
- Comprehensive test coverage

## Project Philosophy

This project demonstrates a unique development approach combining:

1. Rapid AI-assisted prototyping for initial functionality
2. Systematic code refinement using established refactoring patterns
3. Continuous testing throughout the development process

## Getting Started

### Prerequisites

- Deno 1.x or higher
- Local storage access for article archival

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/article-reader.git

# Navigate to project directory
cd article-reader

# Run the application
deno run --allow-net --allow-read --allow-write src/main.ts
```

### Usage

```typescript
// Fetch and archive an article
await processArticle("https://medium.com/your-article-url");

// Read archived article
const article = await readArchivedArticle("article-slug");
```

## Project Structure

```
src/
├── fetchers/           # Article source-specific fetchers
│   ├── medium.ts
│   ├── arxiv.ts
│   ├── nytimes.ts
│   └── types.ts
├── storage.ts          # Storage management
├── markdown.ts         # HTML to Markdown conversion
├── cleanup.ts         # Content cleanup utilities
├── config.ts          # Configuration management
└── main.ts            # Main application logic
```

## Development

The project follows a structured development approach:

1. Start with a complete, single-file solution
2. Extract functions for clear responsibility boundaries
3. Separate concerns into focused modules
4. Maintain comprehensive tests throughout

### Running Tests

```bash
deno task test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Martin Fowler's refactoring patterns
- Deno community
- AI assistance in initial prototype development
