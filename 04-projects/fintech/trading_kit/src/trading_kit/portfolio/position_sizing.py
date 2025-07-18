"""
This module provides functionality for calculating the position size for a trade based on various parameters.

The main function, `calculate_position_size`, determines the number of shares or contracts to trade based on the
account balance, risk per trade, entry price, and stop loss price.

Assumptions:
- The stop loss price must be less than the entry price to ensure a valid trade setup.
- The risk per trade is provided as a percentage of the account balance.

Limitations:
- The function does not handle cases where the calculated position size is not a whole number.
- The function assumes that the input parameters are valid and does not perform extensive validation.
"""

from trading_kit.exceptions import InvalidDataError, InvalidThresholdError


def calculate_position_size(
    account_balance: float,
    risk_per_trade: float,
    entry_price: float,
    stop_loss_price: float,
) -> int:
    """
    Calculate the position size for a trade based on account balance, risk per trade, entry price, and stop loss price.

    Parameters:
    account_balance (float): The total account balance available for trading.
    risk_per_trade (float): The amount of capital to risk on a single trade (as a percentage of account balance).
    entry_price (float): The price at which the trade will be entered.
    stop_loss_price (float): The price at which the trade will be exited to limit losses.

    Returns:
    int: The position size (number of shares/contracts) to trade.

    Raises:
    ValueError: If stop_loss_price is greater than or equal to entry_price.
    """
    # Ensure the stop loss price is less than the entry price to avoid invalid trades
    if stop_loss_price >= entry_price:
        raise InvalidThresholdError("Stop loss price must be less than entry price.")

    # Ensure account balance is positive
    if account_balance <= 0:
        raise InvalidDataError("Account balance must be greater than zero.")

    # Ensure risk per trade is a positive percentage
    if risk_per_trade <= 0 or risk_per_trade > 100:
        raise InvalidThresholdError(
            "Risk per trade must be a positive percentage (0 < risk_per_trade <= 100)."
        )

    # Ensure entry price is positive
    if entry_price <= 0:
        raise InvalidDataError("Entry price must be greater than zero.")

    # Ensure stop loss price is positive
    if stop_loss_price <= 0:
        raise InvalidDataError("Stop loss price must be greater than zero.")

    # Calculate the total amount of money to risk on this trade
    risk_amount = account_balance * (
        risk_per_trade / 100
    )  # Risk amount based on account balance and risk percentage

    # Calculate the risk per share/contract (difference between entry and stop loss prices)
    risk_per_share = (
        entry_price - stop_loss_price
    )  # Determines potential loss per share

    # Determine the position size by dividing the total risk amount by the risk per share
    position_size = (
        risk_amount / risk_per_share
    )  # Calculates how many shares/contracts can be purchased

    # Convert the position size to an integer (whole number of shares/contracts)
    position_size = int(position_size)

    return position_size  # Return the calculated position size
