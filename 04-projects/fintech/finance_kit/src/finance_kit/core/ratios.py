import numpy as np


def calculate_roe(net_income: float, shareholder_equity: float) -> float:
    """
    Calculate Return on Equity (ROE).

    ROE measures a company's profitability in relation to shareholders' equity.

    Args:
        net_income (float): The company's net income.
        shareholder_equity (float): The total shareholder equity.

    Returns:
        float: The calculated ROE as a decimal.

    Raises:
        ValueError: If shareholder_equity is zero or negative.
        TypeError: If inputs are not numeric.
    """
    if not isinstance(net_income, (int, float)) or not isinstance(
        shareholder_equity, (int, float)
    ):
        raise TypeError("Inputs must be numeric.")

    if shareholder_equity <= 0:
        raise ValueError("Shareholder equity must be positive.")

    return net_income / shareholder_equity


# Additional ratio functions can be added here
