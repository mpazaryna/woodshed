# Tasks.py vs Make

## Overview

This project uses `tasks.py` with Python Invoke for task automation instead of a traditional Makefile. Invoke provides a Pythonic approach to task running that integrates seamlessly with our Python codebase while maintaining cross-platform compatibility. This choice allows us to leverage our existing Python ecosystem and provides better maintainability through familiar syntax and tooling.

## Key Benefits of tasks.py in This Project

### Python-Native Development**

* Maintains consistent language usage across the project
* Leverages existing Python knowledge in the team
* Provides full access to Python's extensive ecosystem
* Enables direct integration with project's Python codebase

### Enhanced Development Experience**

* Better IDE support with type hints and docstrings
* Easier debugging through standard Python tools
* Clear documentation through Python docstrings
* Simplified argument parsing built into Invoke

### Cross-Platform Reliability

* Works consistently across Windows, MacOS, and Linux
* Avoids common Make-related issues on Windows
* No need for separate shell scripts per platform

### Maintainability

* Clearer syntax for Python developers
* Easier to extend and modify tasks
* Better version control integration
* Simplified onboarding for Python developers

## Current Usage

Our tasks.py includes commands for:

* Code formatting (`invoke format`)
* Linting (`invoke lint`)
* Running application components (`invoke run-chat`, `invoke run-teacher-kit`)
* Testing (`invoke test-teacher-kit`)
* Text processing (`invoke chunk-files`)
* URL summarization (`invoke summarize-url`)