"""
This module contains pytest tests for the breakout trading strategies implemented in breakout.py.

These tests cover the identification of breakout points and the generation of trading signals.
They assume that the input data is provided as dictionaries with 'date' and 'close' keys.

Note: These tests use pytest fixtures to set up test data.

About Resistance Level:
A resistance level is a price point on a chart where a stock or other asset faces selling pressure,
preventing the price from rising further. When the price breaks through this level, it is often
interpreted as a bullish signal, indicating a potential upward trend. These tests ensure that the
functions correctly identify such breakouts and generate appropriate trading signals.

How Resistance Level is Calculated:
The resistance level is typically identified through technical analysis. It can be calculated using
various methods, such as:
- Historical Price Data: Observing past price points where the stock faced resistance.
- Technical Indicators: Using indicators like moving averages, Fibonacci retracement levels, or pivot points.
- Chart Patterns: Identifying patterns like double tops or head and shoulders that indicate resistance levels.

In these tests, we use a predefined resistance level for simplicity.
"""

import pytest

from trading_kit.strategies.breakout import generate_trading_signals, identify_breakout


@pytest.fixture
def sample_data():
    """
    Fixture to provide sample stock price data for testing.
    """
    return {
        "date": ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04"],
        "close": [100, 105, 110, 95],
    }


def test_identify_breakout(sample_data):
    """
    Test the identify_breakout function with valid data.

    This test verifies that the function correctly identifies dates where the stock price
    breaks through the given resistance level.

    Expected outcome:
    - The function returns a list of dates where the stock price is above the resistance level.
    """
    resistance_level = 104
    expected_breakout_dates = ["2023-01-02", "2023-01-03"]
    assert identify_breakout(sample_data, resistance_level) == expected_breakout_dates


def test_identify_breakout_no_breakout(sample_data):
    """
    Test the identify_breakout function when there are no breakouts.

    This test verifies that the function returns an empty list when no stock prices
    exceed the resistance level.

    Expected outcome:
    - The function returns an empty list.
    """
    resistance_level = 110
    assert identify_breakout(sample_data, resistance_level) == []


def test_generate_trading_signals(sample_data):
    """
    Test the generate_trading_signals function with valid data.

    This test verifies that the function generates the correct trading signals based on
    the given resistance level.

    Expected outcome:
    - The function returns a list of trading signals ('buy' or 'hold') for each date.
    """
    resistance_level = 104
    expected_signals = ["hold", "buy", "buy", "hold"]
    assert generate_trading_signals(sample_data, resistance_level) == expected_signals


def test_generate_trading_signals_all_hold(sample_data):
    """
    Test the generate_trading_signals function when all signals are 'hold'.

    This test verifies that the function returns 'hold' for all dates when no stock prices
    exceed the resistance level.

    Expected outcome:
    - The function returns a list of 'hold' signals for each date.
    """
    resistance_level = 110
    expected_signals = ["hold", "hold", "hold", "hold"]
    assert generate_trading_signals(sample_data, resistance_level) == expected_signals


def test_generate_trading_signals_all_buy(sample_data):
    """
    Test the generate_trading_signals function when all signals are 'buy'.

    This test verifies that the function returns 'buy' for all dates when all stock prices
    exceed the resistance level.

    Expected outcome:
    - The function returns a list of 'buy' signals for each date.
    """
    resistance_level = 90
    expected_signals = ["buy", "buy", "buy", "buy"]
    assert generate_trading_signals(sample_data, resistance_level) == expected_signals
