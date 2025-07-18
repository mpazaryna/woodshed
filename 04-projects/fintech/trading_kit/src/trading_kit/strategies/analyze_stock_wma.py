from typing import Dict, List, Optional, Union

import numpy as np
import pandas as pd

from trading_kit.exceptions import InvalidDataError, InvalidWindowSizeError


def pandas_api_analyze_stock_trends(
    dates: List[str],
    prices: List[float],
    short_window: int = 10,
    long_window: int = 30,
    precision: int = 2,
) -> Dict[str, Union[List[Optional[float]], List[int], str]]:
    """
    Analyze stock price trends using Weighted Moving Averages (WMA) with pandas operations.

    This function converts input data to a pandas DataFrame, calculates short-term and long-term
    Weighted Moving Averages, generates buy/sell signals, and returns the results in an API-friendly format.

    Parameters:
    -----------
    dates : List[str]
        A list of date strings in 'YYYY-MM-DD' format.
    prices : List[float]
        A list of daily closing prices of a stock.
    short_window : int, optional (default=10)
        The window size for the short-term WMA, typically 10-20 days.
    long_window : int, optional (default=30)
        The window size for the long-term WMA, typically 20-50 days.
    precision : int, optional (default=2)
        The number of decimal places to round the WMA results.

    Returns:
    --------
    Dict[str, Union[List[Optional[float]], List[int], str]]
        A dictionary containing:
        - 'short_wma': List of short-term WMA values (None for initial periods)
        - 'long_wma': List of long-term WMA values (None for initial periods)
        - 'signals': List of buy/sell signals (1 for buy, -1 for sell, 0 for hold)
        - 'error': Error message if an exception occurs
    """
    try:
        # Validate input lengths
        if len(dates) != len(prices):
            raise InvalidDataError("The length of dates and prices must be the same.")

        # Convert input data to pandas DataFrame
        df = pd.DataFrame({"date": pd.to_datetime(dates), "price": prices})
        df.set_index("date", inplace=True)

        # Calculate Weighted Moving Averages
        def weighted_moving_average(data, window):
            if window <= 0:
                raise InvalidWindowSizeError("Window size must be a positive integer.")
            weights = pd.Series(range(1, window + 1))
            return data.rolling(window=window).apply(
                lambda x: (x * weights).sum() / weights.sum()
            )

        df["short_wma"] = weighted_moving_average(df["price"], short_window).round(
            precision
        )
        df["long_wma"] = weighted_moving_average(df["price"], long_window).round(
            precision
        )

        # Generate buy/sell signals
        df["signal"] = 0
        df.loc[df["short_wma"] > df["long_wma"], "signal"] = 1  # Buy signal
        df.loc[df["short_wma"] < df["long_wma"], "signal"] = -1  # Sell signal

        # Convert results back to lists for API-friendly output, replacing NaN with None
        return {
            "short_wma": [
                None if pd.isna(x) else float(x) for x in df["short_wma"].tolist()
            ],
            "long_wma": [
                None if pd.isna(x) else float(x) for x in df["long_wma"].tolist()
            ],
            "signals": df["signal"].tolist(),
        }
    except Exception as e:
        return {"error": str(e)}
