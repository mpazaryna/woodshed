"""
momentum.py

This module implements a simple Momentum trading strategy.

Momentum Trading Strategy:
---------------------------
Momentum trading is a strategy that aims to capitalize on the continuance of existing trends in the market. 
The core idea is to buy assets that have shown an upward trend and sell those that have shown a downward trend. 
This strategy assumes that assets which have performed well in the past will continue to perform well in the future, 
and those that have performed poorly will continue to perform poorly.

Key Concepts:
--------------
1. **Momentum**: The rate of acceleration of a security's price or volume. In this strategy, momentum is calculated 
   as the difference between the current price and the previous price.
2. **Signals**: Trading signals are generated based on the momentum. A positive momentum generates a buy signal, 
   while a negative momentum generates a sell signal. No change in momentum results in a hold signal.

Usage:
-------
1. Initialize the strategy with historical price data and parameters.
2. Call the `generate_signals` method to get the trading signals.

Example:
--------
from trading_kit.strategies.momentum import MomentumStrategy

data = [100, 102, 101, 105, 107]
params = {"threshold": 1.0}

strategy = MomentumStrategy(data, params)
signals = strategy.generate_signals()
print(signals)  # Output: [0, 1, -1, 1, 1]
"""

from typing import Any, Dict, List

import pandas as pd

from trading_kit.exceptions import InvalidDataError, InvalidThresholdError


class MomentumStrategy:
    """Simple Momentum trading strategy implementation."""

    def __init__(self, data: List[float], params: Dict[str, Any]):
        if not isinstance(data, list):
            raise InvalidDataError("Input data must be a list.")
        if not all(isinstance(x, (int, float)) for x in data):
            raise InvalidDataError("All elements in data must be int or float.")
        self.data = data
        self.params = params

    def generate_signals(self) -> List[int]:
        """Generate trading signals based on momentum."""
        if "threshold" in self.params and not isinstance(
            self.params["threshold"], (int, float)
        ):
            raise InvalidThresholdError("Threshold must be an int or float.")

        momentum = [
            self.data[i] - self.data[i - 1] if i > 0 else 0
            for i in range(len(self.data))
        ]
        signals = [1 if x > 0 else (-1 if x < 0 else 0) for x in momentum]
        return signals
