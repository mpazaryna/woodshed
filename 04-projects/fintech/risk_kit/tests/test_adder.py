"""
Module for testing the arithmetic functions in the risk_kit.adder module.

This module contains unit tests for the add, subtract, and multiply functions,
ensuring they behave as expected with various inputs.
"""

import logging

import pytest

from risk_kit.adder import add, multiply, subtract

# Configure logging for the tests
logging.basicConfig(level=logging.INFO)


def test_add():
    """Test the add function with various inputs."""
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0


def test_subtract():
    """Test the subtract function with various inputs."""
    assert subtract(5, 3) == 2
    assert subtract(1, 1) == 0
    assert subtract(0, 5) == -5


def test_multiply():
    """Test the multiply function with various inputs."""
    assert multiply(2, 3) == 6
    assert multiply(-1, 4) == -4
    assert multiply(0, 5) == 0
