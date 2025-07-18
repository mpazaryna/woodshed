# src/risk_kit/stock_risk_calculator.py

import math


def volatility_risk(price_history):
    """
    Calculate a simple risk metric for a stock based on its price volatility.

    Args:
    price_history (list): A list of historical stock prices (float values).

    Returns:
    float: A risk score between 0 (low risk) and 1 (high risk).
    """
    if len(price_history) < 2:
        raise ValueError("Price history must contain at least two data points.")

    # Calculate daily returns
    returns = [
        (price_history[i] - price_history[i - 1]) / price_history[i - 1]
        for i in range(1, len(price_history))
    ]

    # Calculate standard deviation of returns
    mean_return = sum(returns) / len(returns)
    squared_diff = [(r - mean_return) ** 2 for r in returns]
    variance = sum(squared_diff) / len(squared_diff)
    std_dev = math.sqrt(variance)

    # Normalize the risk score between 0 and 1
    # Assuming a standard deviation of 0.1 (10%) represents maximum risk
    risk_score = min(std_dev / 0.1, 1)

    return risk_score


# test_stock_risk_calculator.py
