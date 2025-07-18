"""
This module contains unit tests for the moving averages calculations used in financial analysis.
It tests Simple Moving Average (SMA) and Weighted Moving Average (WMA) functions with various scenarios.
Edge cases include handling of None values for initial periods where the window size is not met.
Assumptions: The input data is a pandas Series and the window size is appropriate for the data length.
"""

import pandas as pd
import pytest

from trading_kit.indicators.moving_averages import (
    calculate_ema,
    calculate_sma,
    calculate_wma,
    calculate_wma_precision,
)


def test_calculate_sma():
    """
    Test the Simple Moving Average (SMA) calculation.
    Uses a fixed set of sample data and a window size of 3.
    """
    data = [1, 2, 3, 4, 5]
    expected = [None, None, 2.0, 3.0, 4.0]  # SMA with window=3
    result = calculate_sma(data, window=3)
    assert result == expected


def test_calculate_wma_real_world():
    """
    Test the Weighted Moving Average (WMA) calculation using real-world financial data.
    """
    data = [100, 102, 104, 106, 108]
    expected = [None, None, 102.67, 104.67, 106.67]  # WMA with window=3
    result = calculate_wma(data, window=3)
    result = [round(x, 2) if x is not None else None for x in result]
    assert result == expected


def test_calculate_wma():
    """
    Test the Weighted Moving Average (WMA) calculation.
    Uses a fixed set of sample data and a window size of 3.
    """
    data = [1, 2, 3, 4, 5]
    expected = [
        None,
        None,
        2.3333333333333335,
        3.3333333333333335,
        4.333333333333333,
    ]  # WMA with window=3
    result = calculate_wma(data, window=3)
    assert result == expected


@pytest.mark.parametrize(
    "precision, expected",
    [
        (2, [None, None, 102.67, 104.67, 106.67]),
        (4, [None, None, 102.6667, 104.6667, 106.6667]),
        (6, [None, None, 102.666667, 104.666667, 106.666667]),
    ],
)
def test_calculate_wma_precision(precision, expected):
    """
    Test the Weighted Moving Average (WMA) calculation with variable precision.
    """
    data = [100, 102, 104, 106, 108]
    result = calculate_wma_precision(data, window=3, precision=precision)
    assert result == expected


def test_calculate_ema():
    """
    Test the Exponential Moving Average (EMA) calculation with pure data.

    This test uses a fixed set of sample data and a window size of 3 to verify
    the correctness of the EMA calculation. The expected result is compared
    against the actual result returned by the function.

    Real-World Usage:
    -----------------
    In financial analysis, the EMA is used to give more weight to recent prices,
    making it more responsive to new information. For example, a 3-day EMA of
    stock prices can help traders identify short-term trends more quickly than
    a simple moving average.

    The EMA is also used to generate trading signals. When the price of an asset
    crosses above its EMA, it may be considered a buy signal, indicating that the
    asset's price is gaining upward momentum. Conversely, when the price crosses
    below its EMA, it may be considered a sell signal, indicating that the asset's
    price is losing momentum.

    Examples:
    ---------
    >>> data = [1, 2, 3, 4, 5]
    >>> calculate_ema_pure(data, window=3)
    [None, None, 2.0, 3.5, 4.25]
    """
    data = [1, 2, 3, 4, 5]
    expected = [None, None, 2.0, 3.0, 4.0]  # EMA with window=3
    result = calculate_ema(data, window=3)
    print(f"Expected: {expected}")
    print(f"Result: {result}")
    assert result == expected
