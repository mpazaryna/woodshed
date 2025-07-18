"""
Module: breakout.py
Description: This module implements breakout trading strategies for the company "Acme".
The functions in this module expect dictionaries and lists as inputs and return pure data.

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

Example:
    Acme's stock price breaks through a resistance level, indicating a potential upward trend.
    This module can be used to identify such breakout points and generate trading signals.
"""

import pandas as pd

from trading_kit.exceptions import InvalidDataError, InvalidThresholdError


def identify_breakout(data, resistance_level):
    """
    Identify breakout points where the stock price breaks through a given resistance level.

    Args:
        data (dict): A dictionary containing stock price data with keys 'date' and 'close'.
        resistance_level (float): The resistance level to check for breakouts.

    Returns:
        list: A list of dates where the stock price broke through the resistance level.

    Raises:
        ValueError: If the data dictionary does not contain the required keys or if resistance_level is not a float.

    Example:
        data = {
            'date': ['2023-01-01', '2023-01-02', '2023-01-03'],
            'close': [100, 105, 110]
        }
        resistance_level = 104
        identify_breakout(data, resistance_level)
        # Output: ['2023-01-02', '2023-01-03']
    """
    if not isinstance(data, dict):
        raise InvalidDataError("Data must be a dictionary.")
    if "date" not in data or "close" not in data:
        raise InvalidDataError("Data dictionary must contain 'date' and 'close' keys.")
    if not isinstance(resistance_level, (int, float)):
        raise InvalidThresholdError("Resistance level must be a number.")

    df = pd.DataFrame(data)
    breakout_dates = df[df["close"] > resistance_level]["date"].tolist()
    return breakout_dates


def generate_trading_signals(data, resistance_level):
    """
    Generate trading signals based on breakout points.

    Args:
        data (dict): A dictionary containing stock price data with keys 'date' and 'close'.
        resistance_level (float): The resistance level to check for breakouts.

    Returns:
        list: A list of trading signals ('buy' or 'hold') for each date.

    Raises:
        ValueError: If the data dictionary does not contain the required keys or if resistance_level is not a float.

    Example:
        data = {
            'date': ['2023-01-01', '2023-01-02', '2023-01-03'],
            'close': [100, 105, 110]
        }
        resistance_level = 104
        generate_trading_signals(data, resistance_level)
        # Output: ['hold', 'buy', 'buy']
    """
    if not isinstance(data, dict):
        raise InvalidDataError("Data must be a dictionary.")
    if "date" not in data or "close" not in data:
        raise InvalidDataError("Data dictionary must contain 'date' and 'close' keys.")
    if not isinstance(resistance_level, (int, float)):
        raise InvalidThresholdError("Resistance level must be a number.")

    df = pd.DataFrame(data)
    df["signal"] = df["close"].apply(
        lambda x: "buy" if x > resistance_level else "hold"
    )
    return df["signal"].tolist()
