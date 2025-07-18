# RSS-AI

Inspired by this [article](https://medium.com/@paulo_marcos/save-precious-time-by-letting-ai-read-the-news-for-you-5c0c851e599a).

## Development

This project uses [Poetry](https://python-poetry.org/) for dependency management and [Invoke](http://www.pyinvoke.org/) for task running.

### Setup

1. Install Poetry (if not already installed)
1. Run `poetry install` to install dependencies
1. Activate the virtual environment with `poetry shell`

### Available Tasks

- Run tests: `invoke test` - Executes the test suite.
- Run test coverage: `invoke test-coverage` - Executes the test suite with a coverage report. Generates an HTML report in `docs/coverage/`.
- Run tests with verbose output: `invoke test_verbose` - Executes the test suite with detailed output.
- Lint code: `invoke lint` - Runs the flake8 linter on the codebase.
- Lint and format Markdown: `invoke lint_markdown` - Lints and formats Markdown files using mdformat.
- Format code: `invoke format` - Formats the code using Black.
- Check code: `invoke check` - Runs linting (including Markdown), formatting, and testing in sequence.
- Generate docs: `invoke docs` - Generates HTML documentation using pdoc.

### Markdown Linting and Formatting

This project uses [mdformat](https://github.com/executablebooks/mdformat) for Markdown linting and formatting. To lint and format your Markdown files, run:

## Documentation

The project documentation is generated using pdoc and can be found in the `docs/pdoc/` directory after running `invoke docs`. This directory is not included in the repository.

## Test Coverage

Test coverage reports are generated in the `docs/coverage/` directory after running `invoke test-coverage`. This directory is not included in the repository.

## Actual Article

https://huggingface.co/blog/leaderboard-finbench
