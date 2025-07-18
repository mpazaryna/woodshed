"""
This module provides functions to calculate various types of moving averages,
which are commonly used in technical analysis to smooth out price data and
identify trends in financial markets.

Concept of the Window:
----------------------
The 'window' parameter is a critical concept in the calculation of moving averages.
It defines the number of data points considered in each calculation of the moving
average. The window size determines how many previous data points are included in
the average, affecting the sensitivity and smoothness of the resulting moving average.

- A smaller window size results in a moving average that is more sensitive to recent
  price changes, making it more responsive to short-term fluctuations.
- A larger window size produces a smoother moving average that is less sensitive to
  short-term volatility, providing a clearer view of the long-term trend.

For example, in a 10-day moving average, the window size is 10, meaning that each
calculation of the moving average includes the most recent 10 data points.

Functions:
----------
- calculate_sma(data: List[float], window: int) -> List[Optional[float]]:
    Calculate the Simple Moving Average (SMA) for a given list of data points.

- calculate_wma(data: List[float], window: int) -> List[Optional[float]]:
    Calculate the Weighted Moving Average (WMA) for a given list of data points.

- calculate_wma_precision(data: List[float], window: int, precision: int = 2) -> List[Optional[float]]:
    Calculate the Weighted Moving Average (WMA) with variable precision for a given list of data points.

- calculate_ema(data: List[float], window: int) -> List[Optional[float]]:
    Calculate the Exponential Moving Average (EMA) for a given list of data points.

- calculate_ema_pure(data: List[float], window: int) -> List[Optional[float]]:
    Calculate the Exponential Moving Average (EMA) for a given list of data points using a pure Python implementation.
"""

from typing import List, Optional

import numpy as np
import pandas as pd

from trading_kit.exceptions import (
    InvalidDataError,
    InvalidWindowSizeError,
    TradingKitError,
)


def calculate_sma(data: List[float], window: int) -> List[Optional[float]]:
    """
    Calculate Simple Moving Average (SMA).

    The Simple Moving Average (SMA) is a widely used indicator in technical analysis
    that helps smooth out price data by creating a constantly updated average price.
    It is calculated by taking the arithmetic mean of a given set of values over a
    specified number of periods.

    Real-World Usage:
    -----------------
    The SMA is used by traders and analysts to identify trends in financial markets.
    By averaging price data, the SMA reduces the noise from random price fluctuations,
    making it easier to identify the underlying trend. For example, a 50-day SMA of
    a stock's closing prices can help traders determine the overall direction of the
    stock's price movement over the past 50 days.

    The SMA is also used to generate trading signals. When the price of an asset
    crosses above its SMA, it may be considered a buy signal, indicating that the
    asset's price is gaining upward momentum. Conversely, when the price crosses
    below its SMA, it may be considered a sell signal, indicating that the asset's
    price is losing momentum.

    Parameters:
    -----------
    data : List[float]
        A list of numerical data points (e.g., stock prices).

    window : int
        The size of the moving window. This determines how many previous data
        points are considered in each SMA calculation. Must be a positive integer.

    Returns:
    --------
    List[Optional[float]]
        A list containing the calculated SMA values. The first (window - 1) elements
        will be None, as there are not enough previous data points to calculate the SMA.

    Examples:
    ---------
    >>> data = [1, 2, 3, 4, 5]
    >>> calculate_sma(data, window=3)
    [None, None, 2.0, 3.0, 4.0]
    """
    # Input validation
    if not isinstance(data, list) or not all(isinstance(x, (int, float)) for x in data):
        raise InvalidDataError("Data must be a list of numerical values.")
    if not isinstance(window, int) or window <= 0:
        raise InvalidWindowSizeError("Window size must be a positive integer.")
    if len(data) < window:
        raise InvalidWindowSizeError(
            "Data length must be greater than or equal to the window size."
        )

    try:
        series = pd.Series(data)
        sma = series.rolling(window=window).mean()
        return [None if pd.isna(x) else float(x) for x in sma]
    except Exception as e:
        raise TradingKitError(f"An error occurred while calculating SMA: {e}")


def calculate_wma(data: List[float], window: int) -> List[Optional[float]]:
    """
    Calculate Weighted Moving Average (WMA).

    The Weighted Moving Average (WMA) is a type of moving average that assigns
    more weight to recent data points, making it more responsive to new information
    compared to the Simple Moving Average (SMA). The weights decrease linearly,
    with the most recent data point having the highest weight.

    Real-World Usage:
    -----------------
    The WMA is used by traders and analysts to identify trends and potential
    reversals in financial markets. By giving more weight to recent prices, the
    WMA is more sensitive to recent price changes, making it useful for detecting
    short-term trends and momentum shifts.

    The WMA is particularly useful in volatile markets where recent price movements
    are more relevant for making trading decisions. For example, a 10-day WMA of a
    stock's closing prices can help traders identify short-term trends and potential
    entry or exit points based on recent price action.

    Parameters:
    -----------
    data : List[float]
        A list of numerical data points (e.g., stock prices).

    window : int
        The size of the moving window. This determines how many previous data
        points are considered in each WMA calculation. Must be a positive integer.

    Returns:
    --------
    List[Optional[float]]
        A list containing the calculated WMA values. The first (window - 1) elements
        will be None, as there are not enough previous data points to calculate the WMA.

    Examples:
    ---------
    >>> data = [1, 2, 3, 4, 5]
    >>> calculate_wma(data, window=3)
    [None, None, 2.3333333333333335, 3.3333333333333335, 4.333333333333333]
    """
    # Input validation
    if not isinstance(data, list) or not all(isinstance(x, (int, float)) for x in data):
        raise InvalidDataError("Data must be a list of numerical values.")
    if not isinstance(window, int) or window <= 0:
        raise InvalidWindowSizeError("Window size must be a positive integer.")
    if len(data) < window:
        raise InvalidWindowSizeError(
            "Data length must be greater than or equal to the window size."
        )

    try:
        series = pd.Series(data)
        weights = pd.Series(range(1, window + 1))  # Create weights [1, 2, ..., window]
        wma = series.rolling(window).apply(
            lambda prices: (prices * weights).sum() / weights.sum(), raw=True
        )
        return [None if pd.isna(x) else float(x) for x in wma]
    except Exception as e:
        raise TradingKitError(f"An error occurred while calculating WMA: {e}")


def calculate_wma_precision(
    data: List[float], window: int, precision: int = 2
) -> List[Optional[float]]:
    # Input validation
    if not isinstance(data, list) or not all(isinstance(x, (int, float)) for x in data):
        raise InvalidDataError("Data must be a list of numerical values.")
    if not isinstance(window, int) or window <= 0:
        raise InvalidWindowSizeError("Window size must be a positive integer.")
    if len(data) < window:
        raise InvalidWindowSizeError(
            "Data length must be greater than or equal to the window size."
        )
    if not isinstance(precision, int) or precision < 0:
        raise InvalidDataError("Precision must be a non-negative integer.")

    try:
        series = pd.Series(data)
        weights = pd.Series(range(1, window + 1))
        wma = series.rolling(window).apply(
            lambda prices: (prices * weights).sum() / weights.sum(), raw=True
        )
        return [None if pd.isna(x) else round(float(x), precision) for x in wma]
    except Exception as e:
        raise TradingKitError(
            f"An error occurred while calculating WMA with precision: {e}"
        )


def calculate_ema(data: List[float], window: int) -> List[Optional[float]]:
    """
    Calculate Exponential Moving Average (EMA).

    The Exponential Moving Average (EMA) is a type of moving average that places
    a greater weight and significance on the most recent data points. The EMA reacts
    more quickly to recent price changes than the Simple Moving Average (SMA), making
    it a popular choice among traders and analysts.

    Real-World Usage:
    -----------------
    The EMA is used to identify trends and potential reversals in financial markets.
    By giving more weight to recent prices, the EMA is more responsive to new information,
    making it useful for detecting short-term trends and momentum shifts. For example,
    a 10-day EMA of a stock's closing prices can help traders identify short-term trends
    and potential entry or exit points based on recent price action.

    The EMA is also used to generate trading signals. When the price of an asset crosses
    above its EMA, it may be considered a buy signal, indicating that the asset's price
    is gaining upward momentum. Conversely, when the price crosses below its EMA, it may
    be considered a sell signal, indicating that the asset's price is losing momentum.

    Parameters:
    -----------
    data : List[float]
        A list of numerical data points (e.g., stock prices).

    window : int
        The size of the moving window. This determines the smoothing factor for the EMA.
        Must be a positive integer.

    Returns:
    --------
    List[Optional[float]]
        A list containing the calculated EMA values. The first (window - 1) elements
        will be None, as there are not enough previous data points to calculate the EMA.

    Examples:
    ---------
    >>> data = [1, 2, 3, 4, 5]
    >>> calculate_ema(data, window=3)
    [None, None, 2.0, 3.5, 4.25]
    """
    # Input validation
    if not isinstance(data, list) or not all(isinstance(x, (int, float)) for x in data):
        raise InvalidDataError("Data must be a list of numerical values.")
    if not isinstance(window, int) or window <= 0:
        raise InvalidWindowSizeError("Window size must be a positive integer.")
    if len(data) < window:
        raise InvalidWindowSizeError(
            "Data length must be greater than or equal to the window size."
        )

    ema: List[Optional[float]] = [None] * len(data)
    alpha = 2 / (window + 1)

    try:
        for i in range(len(data)):
            if i < window - 1:
                ema[i] = None
            elif i == window - 1:
                ema[i] = sum(data[:window]) / window
            else:
                previous_ema = ema[i - 1]
                if previous_ema is None:
                    raise InvalidDataError(
                        f"Unexpected None value at index {i - 1} in EMA calculation."
                    )
                ema[i] = alpha * data[i] + (1 - alpha) * previous_ema
    except Exception as e:
        raise TradingKitError(f"An error occurred while calculating EMA: {e}")

    return ema


def calculate_ema_pure(data: List[float], window: int) -> List[Optional[float]]:
    """
    Calculate Exponential Moving Average (EMA) for a list of data.

    The Exponential Moving Average (EMA) is a type of moving average that places
    a greater weight and significance on the most recent data points. The EMA reacts
    more quickly to recent price changes than the Simple Moving Average (SMA), making
    it a popular choice among traders and analysts.

    Real-World Usage:
    -----------------
    The EMA is used to identify trends and potential reversals in financial markets.
    By giving more weight to recent prices, the EMA is more responsive to new information,
    making it useful for detecting short-term trends and momentum shifts. For example,
    a 10-day EMA of a stock's closing prices can help traders identify short-term trends
    and potential entry or exit points based on recent price action.

    The EMA is also used to generate trading signals. When the price of an asset crosses
    above its EMA, it may be considered a buy signal, indicating that the asset's price
    is gaining upward momentum. Conversely, when the price crosses below its EMA, it may
    be considered a sell signal, indicating that the asset's price is losing momentum.

    Parameters:
    -----------
    data : List[float]
        A list of numerical data points (e.g., stock prices).

    window : int
        The size of the moving window. This determines the smoothing factor for the EMA.
        Must be a positive integer.

    Returns:
    --------
    List[Optional[float]]
        A list containing the calculated EMA values. The first (window - 1) elements
        will be None, as there are not enough previous data points to calculate the EMA.

    Examples:
    ---------
    >>> data = [1, 2, 3, 4, 5]
    >>> calculate_ema_pure(data, window=3)
    [None, None, 2.0, 3.5, 4.25]
    """
    # Input validation
    if not isinstance(data, list) or not all(isinstance(x, (int, float)) for x in data):
        raise InvalidDataError("Data must be a list of numerical values.")
    if not isinstance(window, int) or window <= 0:
        raise InvalidWindowSizeError("Window size must be a positive integer.")
    if len(data) < window:
        raise InvalidWindowSizeError(
            "Data length must be greater than or equal to the window size."
        )

    ema: List[Optional[float]] = [None] * len(data)
    alpha = 2 / (window + 1)

    try:
        for i in range(len(data)):
            if i == 0:
                ema[i] = data[i]
            elif i < window - 1:
                ema[i] = None
            else:
                previous_ema = ema[i - 1]
                if previous_ema is None:
                    raise InvalidDataError(
                        f"Unexpected None value at index {i - 1} in EMA calculation."
                    )
                ema[i] = alpha * data[i] + (1 - alpha) * previous_ema
    except Exception as e:
        raise TradingKitError(f"An error occurred while calculating EMA: {e}")

    return ema
