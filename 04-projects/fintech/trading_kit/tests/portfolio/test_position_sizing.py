import pytest

from trading_kit.exceptions import InvalidThresholdError
from trading_kit.portfolio.position_sizing import calculate_position_size


def test_calculate_position_size():
    # Real-world example
    account_balance = 10000  # $10,000 account balance
    risk_per_trade = 1  # Risking 1% of the account
    entry_price = 50  # Entry price of the stock
    stop_loss_price = 48  # Stop loss price

    expected_position_size = 50  # Updated expected position size calculation

    # Calculate position size
    position_size = calculate_position_size(
        account_balance, risk_per_trade, entry_price, stop_loss_price
    )

    assert position_size == expected_position_size


def test_invalid_stop_loss():
    with pytest.raises(InvalidThresholdError):
        calculate_position_size(10000, 1, 50, 50)  # Stop loss equal to entry price
