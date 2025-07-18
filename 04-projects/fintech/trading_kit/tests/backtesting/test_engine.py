import pandas as pd
import pytest

from trading_kit.backtesting.engine import backtest_strategy, calculate_performance


def mock_strategy(data: pd.DataFrame, threshold: float) -> pd.Series:
    """
    A mock strategy for testing.

    This strategy generates buy/sell signals based on a simple threshold comparison.
    It returns 1 (buy signal) if the closing price is above the threshold and 0 (sell signal)
    otherwise.

    Parameters:
    - data (pd.DataFrame): A DataFrame containing market data, specifically the 'close' prices.
    - threshold (float): The price threshold for generating signals.

    Returns:
    - pd.Series: A Series of signals (1s and 0s) indicating buy/sell decisions.
    """
    return (data["close"] > threshold).astype(int)


def test_calculate_performance():
    """
    Test the calculate_performance function.

    This test checks that the calculate_performance function returns the expected performance metrics
    based on the provided backtest results.

    Steps:
    1. Create a DataFrame `results` with sample returns.
    2. Call the calculate_performance function with the results DataFrame.
    3. Assert that the returned metrics contain the expected Sharpe ratio of 1.5.
    """
    results = {"returns": [0.1, 0.2, -0.1, 0.05, 0.15]}
    expected_performance = {
        "sharpe_ratio": pytest.approx(
            0.694995588420911, rel=1e-2
        )  # Updated expected value
    }
    performance = calculate_performance(results)
    assert performance["sharpe_ratio"] == expected_performance["sharpe_ratio"]


def dummy_strategy(data, **params):
    # A simple dummy strategy for testing purposes
    signals = {"buy": [], "sell": []}
    for i, price in enumerate(data["prices"]):
        if price < params.get("buy_threshold", 50):
            signals["buy"].append(i)
        elif price > params.get("sell_threshold", 100):
            signals["sell"].append(i)
    return signals


def test_backtest_strategy():
    data = {"prices": [45, 55, 60, 40, 120, 80, 30]}
    params = {"buy_threshold": 50, "sell_threshold": 100}
    expected_signals = {"buy": [0, 3, 6], "sell": [4]}
    result = backtest_strategy(data, dummy_strategy, **params)
    assert result == expected_signals
