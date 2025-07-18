"""
monte_carlo.test_simulation

This module contains unit tests for the Monte Carlo simulation functions.
"""

import pytest

from risk_kit.monte_carlo import monte_carlo_integration


def test_monte_carlo_integration():
    """
    Test the monte_carlo_integration function with a simple function.

    The function f(x) = x^2 is used for testing. The integral from 0 to 1
    should be approximately 1/3.
    """

    def test_func(x):
        return x**2

    estimated_value = monte_carlo_integration(test_func, 0, 1, 10000)
    assert abs(estimated_value - (1 / 3)) < 0.01  # Allowable error margin
