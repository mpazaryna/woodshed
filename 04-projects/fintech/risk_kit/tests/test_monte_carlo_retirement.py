"""
monte_carlo.test_retirement_planning

This module contains unit tests for retirement planning using Monte Carlo simulation.
"""

import random

import pytest

from risk_kit.monte_carlo import monte_carlo_integration


def future_value_investment(
    annual_investment, years, stock_return, bond_return, stock_allocation
):
    """
    Calculate the future value of an investment portfolio using Monte Carlo simulation.

    Parameters:
    - annual_investment: The amount invested annually.
    - years: The number of years until retirement.
    - stock_return: The expected annual return for stocks.
    - bond_return: The expected annual return for bonds.
    - stock_allocation: The proportion of the portfolio allocated to stocks.

    Returns:
    - float: The estimated future value of the investment portfolio.
    """

    def investment_growth(x):
        # Simulate the growth of the investment based on random returns
        stock_growth = (1 + stock_return + random.uniform(-0.02, 0.02)) ** (
            years
        ) * stock_allocation
        bond_growth = (1 + bond_return + random.uniform(-0.01, 0.01)) ** (years) * (
            1 - stock_allocation
        )
        return annual_investment * (stock_growth + bond_growth)

    # Use Monte Carlo integration to estimate the future value
    estimated_value = monte_carlo_integration(investment_growth, 0, 1, 10000)
    return estimated_value


def test_retirement_investment_simulation():
    """
    Test the future value of an investment portfolio for retirement planning.

    This test simulates the expected future value of an investment portfolio
    consisting of stocks and bonds over a 35-year period.
    """
    annual_investment = 10000  # Annual investment amount
    years = 35  # Investment duration until retirement
    stock_return = 0.07  # Expected return for stocks
    bond_return = 0.03  # Expected return for bonds
    stock_allocation = 0.70  # 70% in stocks

    # Calculate the estimated future value of the investment
    estimated_future_value = future_value_investment(
        annual_investment, years, stock_return, bond_return, stock_allocation
    )

    # Check if the estimated future value is within a reasonable range
    assert estimated_future_value > 0  # The future value should be positive
    assert estimated_future_value < 5000000  # Arbitrary upper limit for the test
