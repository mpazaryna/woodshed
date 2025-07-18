# trading_kit/strategies/mean_reversion.py

from typing import List

import pandas as pd

from trading_kit.exceptions import InvalidDataError, InvalidThresholdError


def validate_input_data(
    data: List[float], entry_threshold: float, exit_threshold: float
) -> None:
    """Validate the input data and thresholds."""
    if not isinstance(data, list):
        raise InvalidDataError("Input data must be a list.")
    if not all(isinstance(x, (int, float)) for x in data):
        raise InvalidDataError("All elements in the input data must be numbers.")
    if len(data) == 0:
        raise InvalidDataError("Input data list cannot be empty.")
    if not isinstance(entry_threshold, (int, float)):
        raise InvalidThresholdError("Entry threshold must be a number.")
    if not isinstance(exit_threshold, (int, float)):
        raise InvalidThresholdError("Exit threshold must be a number.")
    if entry_threshold < 0:
        raise InvalidThresholdError("Entry threshold must be non-negative.")
    if exit_threshold < 0:
        raise InvalidThresholdError("Exit threshold must be non-negative.")


def calculate_z_score(data: List[float]) -> List[float]:
    """Calculate the Z-score of a given data series."""
    if not isinstance(data, list):
        raise InvalidDataError("Input data must be a list.")
    if not all(isinstance(x, (int, float)) for x in data):
        raise InvalidDataError("All elements in the input data must be numbers.")
    if len(data) == 0:
        raise InvalidDataError("Input data list cannot be empty.")

    data_series = pd.Series(data)
    z_scores = (data_series - data_series.mean()) / data_series.std()
    return z_scores.tolist()


def generate_signals(
    z_scores: List[float], entry_threshold: float, exit_threshold: float
) -> List[int]:
    """Generate trading signals based on Z-scores and thresholds."""
    signals = [0] * len(z_scores)
    for i, z in enumerate(z_scores):
        if z < -entry_threshold:
            signals[i] = 1  # Buy signal
        elif z > entry_threshold:
            signals[i] = -1  # Sell signal
        elif -exit_threshold <= z <= exit_threshold:
            signals[i] = 0  # Hold signal
    return signals


def generate_mean_reversion_signals(
    data: List[float], entry_threshold: float = 1.0, exit_threshold: float = 0.0
) -> List[int]:
    """
    Generate trading signals based on a mean reversion strategy.
    """
    validate_input_data(data, entry_threshold, exit_threshold)
    z_scores = calculate_z_score(data)
    return generate_signals(z_scores, entry_threshold, exit_threshold)


# Additional functions for the strategy can be added here...
