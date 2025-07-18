# aiforge

![Python CI](https://github.com/mpazaryna/aiforge/actions/workflows/.ci.yml/badge.svg?branch=main)

## CI/CD

- OPENAI_API_KEY must be visible for CI/CD to work.
- Added, but still failing.

## Development

For information about setting up the development environment, known issues, and workarounds, please see our [Development Guide](DEVELOPMENT.md).

## Development Tasks

This project uses [Invoke](http://www.pyinvoke.org/) to manage development tasks. Invoke is a Python task execution tool and library, making it easy to run common development operations.

### Available Tasks

To run a task, use the `invoke` command followed by the task name:

- `invoke test`: Run the test suite
- `invoke lint`: Run linting checks
- `invoke format`: Format the code
- `invoke docs`: Build the documentation
- `invoke docs --serve`: Build and serve the documentation locally
- `invoke clean-docs`: Clean the documentation build directory
- `invoke all`: Run formatting, linting, tests, and build docs

### Setup

Invoke is included in the project's development dependencies. After setting up your Poetry environment, you can run tasks using:
