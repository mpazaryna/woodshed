from datetime import datetime, timedelta
from typing import List, Tuple

import pytest

from trading_kit.strategies.analyze_stock_wma import pandas_api_analyze_stock_trends


def generate_test_data(days: int) -> Tuple[List[str], List[float]]:
    base_date = datetime(2023, 1, 1)
    dates = [(base_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(days)]
    prices = [100 + i * 0.1 for i in range(days)]  # Simple linear price increase
    return dates, prices


def test_pandas_api_analyze_stock_trends():
    # Generate 50 days of test data
    dates, prices = generate_test_data(50)

    # Test with default parameters
    result = pandas_api_analyze_stock_trends(dates, prices)

    # Check if the result contains all expected keys
    assert set(result.keys()) == {"short_wma", "long_wma", "signals"}

    # Check if the lengths of the result lists match the input length
    assert len(result["short_wma"]) == len(prices)
    assert len(result["long_wma"]) == len(prices)
    assert len(result["signals"]) == len(prices)

    # Check if the first elements are None as expected
    assert all(x is None for x in result["short_wma"][:9])
    assert all(x is None for x in result["long_wma"][:29])

    # Check if the values are rounded to the specified precision
    assert all(
        isinstance(x, float) and round(x, 2) == x
        for x in result["short_wma"][9:]
        if x is not None
    )
    assert all(
        isinstance(x, float) and round(x, 2) == x
        for x in result["long_wma"][29:]
        if x is not None
    )

    # Check if signals are valid
    assert all(x in {1, -1, 0} for x in result["signals"])

    # Test with custom parameters
    custom_result = pandas_api_analyze_stock_trends(
        dates, prices, short_window=5, long_window=15, precision=3
    )

    assert len(custom_result["short_wma"]) == len(prices)
    assert len(custom_result["long_wma"]) == len(prices)
    assert len(custom_result["signals"]) == len(prices)

    assert all(x is None for x in custom_result["short_wma"][:4])
    assert all(x is None for x in custom_result["long_wma"][:14])

    assert all(
        isinstance(x, float) and round(x, 3) == x
        for x in custom_result["short_wma"][4:]
        if x is not None
    )
    assert all(
        isinstance(x, float) and round(x, 3) == x
        for x in custom_result["long_wma"][14:]
        if x is not None
    )
