import pytest

from trading_kit.exceptions import (
    InvalidDataError,
    InvalidThresholdError,
    TradingKitError,
)


def test_trading_kit_error():
    """
    Test that TradingKitError is raised with the correct message.

    This test ensures that the base exception for the trading kit is raised correctly
    and that the error message matches the expected output.
    """
    with pytest.raises(TradingKitError, match="This is a base error"):
        raise TradingKitError("This is a base error")


def test_invalid_data_error():
    """
    Test that InvalidDataError is raised with the correct message.

    This test ensures that the InvalidDataError is raised correctly when invalid data is provided
    and that the error message matches the expected output.
    """
    with pytest.raises(InvalidDataError, match="Invalid data provided"):
        raise InvalidDataError("Invalid data provided")


def test_invalid_threshold_error():
    """
    Test that InvalidThresholdError is raised with the correct message.

    This test ensures that the InvalidThresholdError is raised correctly when an invalid threshold value is provided
    and that the error message matches the expected output.
    """
    with pytest.raises(InvalidThresholdError, match="Invalid threshold value"):
        raise InvalidThresholdError("Invalid threshold value")
