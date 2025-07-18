# Example Kit Module Documentation

## Overview

`example_kit` is a sample Python module demonstrating best practices for module structure, testing, and usage within a larger project. This module is designed to showcase how to organize code, handle imports, and set up tests in a clean and maintainable way.

## Module Structure

The `example_kit` module is structured as follows:

```
src/
└── example_kit/
    ├── __init__.py
    ├── src/
    │   ├── __init__.py
    │   ├── core.py
    │   ├── utils.py
    │   └── models/
    │       ├── __init__.py
    │       └── base_model.py
    ├── tests/
    │   ├── __init__.py
    │   ├── test_core.py
    │   └── test_base_model.py
    └── docs/
        └── README.md (this file)
```

### Key Components

- `src/`: Contains the main source code for the module.
- `tests/`: Contains all unit tests for the module.
- `docs/`: Contains documentation (like this README).

## Installation

As this module is part of a larger project using Poetry, it's automatically included when you install the main project. Ensure you have Poetry installed and run:

```bash
poetry install
```

from the root directory of the main project.

## Usage

### Importing

You can import components from `example_kit` as follows:

```python
from example_kit import ExampleCore
from example_kit.models import BaseModel
```

### Basic Usage

Here's a simple example of using the `ExampleCore` class:

```python
from example_kit import ExampleCore

core = ExampleCore("MyExample")
print(core.greet())  # Output: Hello from MyExample!
print(core.process("test"))  # Output: Processed: TEST
```

## Module Contents

### `core.py`

Contains the `ExampleCore` class, which demonstrates basic functionality.

```python
class ExampleCore:
    def __init__(self, name: str):
        self.name = name

    def greet(self) -> str:
        return f"Hello from {self.name}!"

    def process(self, data: str) -> str:
        return f"Processed: {data.upper()}"
```

### `models/base_model.py`

Contains the `BaseModel` abstract base class, which can be used as a template for other models.

```python
from abc import ABC, abstractmethod

class BaseModel(ABC):
    @abstractmethod
    def predict(self, data: dict) -> dict:
        pass

    @abstractmethod
    def train(self, data: list[dict]) -> None:
        pass
```

## Testing

Tests are located in the `tests/` directory. To run tests:

```bash
poetry run pytest src/example_kit/tests
```

Example test (`test_core.py`):

```python
import pytest
from example_kit import ExampleCore

def test_example_core_greet():
    core = ExampleCore("Test")
    assert core.greet() == "Hello from Test!"

def test_example_core_process():
    core = ExampleCore("Test")
    assert core.process("hello") == "Processed: HELLO"
```

## Extending the Module

To add new functionality:

1. Create new Python files in the `src/` directory or its subdirectories.
2. Update `__init__.py` files to expose new classes or functions as needed.
3. Add corresponding test files in the `tests/` directory.

## Best Practices

- Keep the `src/` directory for all source code.
- Maintain tests separately in the `tests/` directory.
- Use relative imports within the module.
- Expose only necessary components in `__init__.py` files.
- Follow PEP 8 style guidelines for Python code.

## Contributing

When contributing to this module:

1. Ensure all new functionality has corresponding tests.
2. Update this documentation as necessary.
3. Follow the existing code structure and naming conventions.

---

This documentation provides an overview of the `example_kit` module structure and usage. For more detailed information about specific components, refer to the inline documentation within each Python file.