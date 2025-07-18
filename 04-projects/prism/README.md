# PRISM: Private Research and Intelligence System for Markets

## Overview

PRISM (Private Research and Intelligence System for Markets) is an advanced, AI-assisted research tool designed to streamline and enhance the process of investigating private companies. By leveraging cutting-edge AI technologies and a robust, pipeline-driven architecture, PRISM offers unparalleled insights into private market dynamics, company performance, and industry trends.

## Key Features

- **Automated Data Collection**: Efficiently gather data from various public sources.
- **AI-Powered Analysis**: Utilize state-of-the-art AI models to identify trends, patterns, and insights.
- **Customizable Research Pipeline**: Tailor the research process to specific industries or investigation types.
- **Comprehensive Reporting**: Generate detailed, visually appealing reports with actionable insights.
- **Extensible Architecture**: Easily integrate new data sources, analysis techniques, or reporting formats.

## Project Structure

PRISM follows a functional programming paradigm with a pipeline-driven approach, ensuring modularity, testability, and ease of extension. The core components include:

- `pipeline.py`: Orchestrates the entire research process.
- `company.py`: Manages the list of companies to research.
- `collector.py`: Handles data gathering from various sources.
- `analysis.py`: Contains AI-driven analysis functions.
- `reporting.py`: Generates and formats reports.
- `utils.py`: Houses utility functions used across the project.

## Available Tasks

PRISM uses Invoke to manage various development tasks. Here's a list of available tasks:

| Task | Command | Description |
|------|---------|-------------|
| Run all tests | `invoke test` | Runs the entire test suite using pytest |
| Run integration tests | `invoke integration-test` | Runs only the integration tests |
| Run unit tests | `invoke unit-test` | Runs all tests except integration tests |
| Lint code | `invoke lint` | Runs flake8 and mypy for code linting |
| Format code | `invoke format` | Formats the codebase using black and isort |
| Run pre-commit hooks | `invoke pre-commit` | Runs pre-commit hooks on all files |
| Generate documentation | `invoke pdoc` | Generates API documentation using pdoc |
| Run all tasks | `invoke all` | Runs format, lint, and test tasks in sequence |

To run a task, use the `invoke` command followed by the task name. For example:

```shell
invoke test
```

bump