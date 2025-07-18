# src/example_kit/tests/test_core.py

import pytest

from example_kit import ExampleCore


def test_example_core_greet():
    core = ExampleCore("Test")
    assert core.greet() == "Hello from Test!"


def test_example_core_process():
    core = ExampleCore("Test")
    assert core.process("hello") == "Processed: HELLO"
