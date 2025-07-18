# trading_kit/tests/test_mean_reversion.py

import pandas as pd
import pytest

from trading_kit.exceptions import InvalidDataError, InvalidThresholdError
from trading_kit.strategies.mean_reversion import (
    calculate_z_score,
    generate_mean_reversion_signals,
)


def test_generate_mean_reversion_signals():
    """
    Test the generate_mean_reversion_signals function.
    """
    # Sample data representing stock closing prices
    data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    # Generate signals
    signals = generate_mean_reversion_signals(
        data, entry_threshold=1.0, exit_threshold=0.0
    )

    # Check expected signals
    expected_signals = [1, 1, 0, 0, 0, 0, 0, 0, -1, -1]

    assert signals == expected_signals


# Additional tests can be added here...
def test_generate_mean_reversion_signals_real_world_example():
    """
    Test the generate_mean_reversion_signals function with real-world example data.
    """
    # Sample data representing stock closing prices for Company A
    data_a = [50, 52, 51, 49, 48, 47, 48, 51, 55, 54]

    # Generate signals for Company A
    signals_a = generate_mean_reversion_signals(
        data_a, entry_threshold=1.0, exit_threshold=0.0
    )

    # Debugging: Print Z-scores and generated signals for Company A
    z_scores_a = calculate_z_score(data_a)
    print("Z-scores for Company A:", z_scores_a)
    print("Generated signals for Company A:", signals_a)

    # Adjusted expected signals for Company A
    expected_signals_a = [0, 0, 0, 0, 0, 1, 0, 0, -1, -1]
    assert signals_a == expected_signals_a

    # Sample data representing stock closing prices for Company B
    data_b = [200, 202, 198, 205, 210, 207, 208, 202, 195, 190]

    # Generate signals for Company B
    signals_b = generate_mean_reversion_signals(
        data_b, entry_threshold=1.0, exit_threshold=0.0
    )

    # Debugging: Print Z-scores and generated signals for Company B
    z_scores_b = calculate_z_score(data_b)
    print("Z-scores for Company B:", z_scores_b)
    print("Generated signals for Company B:", signals_b)

    # Adjusted expected signals for Company B
    expected_signals_b = [0, 0, 0, 0, -1, 0, -1, 0, 1, 1]
    assert signals_b == expected_signals_b


def test_calculate_z_score_real_world_example():
    """
    Test the calculate_z_score function with real-world example data.

    This test verifies the correctness of the calculate_z_score function by using
    stock closing prices from the Mean Reversion strategy example in the
    mean_revision.md file. The Z-score is a statistical measure that indicates
    how many standard deviations a data point is from the mean. In this context,
    it helps identify whether the stock prices are significantly above or below
    their historical average.

    The test uses the following data for Company A:
    - Closing prices: [50, 52, 51, 49, 48, 47, 48, 51, 55, 54]

    The expected Z-scores for these prices are calculated manually and compared
    against the output of the calculate_z_score function to ensure accuracy.

    The expected Z-scores for Company A are:
    - Mean (μ): 50.4
    - Standard Deviation (σ): 2.52
    - Z-scores: [-0.189737, 0.569210, 0.189737, -0.569210, -0.948683, -1.328157, -0.948683, 0.189737, 1.707630, 1.328157]

    The test will assert that the calculated Z-scores match the expected values.
    """
    # Sample data representing stock closing prices for Company A
    data_a = [50, 52, 51, 49, 48, 47, 48, 51, 55, 54]

    # Calculate Z-scores using the function
    calculated_z_scores_a = calculate_z_score(data_a)

    # Expected Z-scores for Company A
    expected_z_scores_a = [
        -0.189737,
        0.569210,
        0.189737,
        -0.569210,
        -0.948683,
        -1.328157,
        -0.948683,
        0.189737,
        1.707630,
        1.328157,
    ]

    # Assert that the calculated Z-scores match the expected values
    assert calculated_z_scores_a == pytest.approx(expected_z_scores_a, rel=1e-5)


# Additional tests can be added here...


def test_calculate_z_score_invalid_data():
    with pytest.raises(InvalidDataError, match="Input data must be a list."):
        calculate_z_score("not a list")

    with pytest.raises(
        InvalidDataError, match="All elements in the input data must be numbers."
    ):
        calculate_z_score([1, 2, "three", 4])

    with pytest.raises(InvalidDataError, match="Input data list cannot be empty."):
        calculate_z_score([])


def test_generate_mean_reversion_signals_invalid_data():
    with pytest.raises(InvalidDataError, match="Input data must be a list."):
        generate_mean_reversion_signals("not a list")

    with pytest.raises(
        InvalidDataError, match="All elements in the input data must be numbers."
    ):
        generate_mean_reversion_signals([1, 2, "three", 4])

    with pytest.raises(InvalidDataError, match="Input data list cannot be empty."):
        generate_mean_reversion_signals([])


def test_generate_mean_reversion_signals_invalid_thresholds():
    data = [1, 2, 3, 4, 5]

    with pytest.raises(
        InvalidThresholdError, match="Entry threshold must be a number."
    ):
        generate_mean_reversion_signals(data, entry_threshold="not a number")

    with pytest.raises(InvalidThresholdError, match="Exit threshold must be a number."):
        generate_mean_reversion_signals(data, exit_threshold="not a number")

    with pytest.raises(
        InvalidThresholdError, match="Entry threshold must be non-negative."
    ):
        generate_mean_reversion_signals(data, entry_threshold=-1)

    with pytest.raises(
        InvalidThresholdError, match="Exit threshold must be non-negative."
    ):
        generate_mean_reversion_signals(data, exit_threshold=-1)


# Additional tests can be added here...
