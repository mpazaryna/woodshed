"""
Module for calculating various financial risk measures including expected value,
variance, standard deviation, value at risk (VaR), and conditional value at risk (CVaR).
"""


def expected_value(values, probabilities):
    """
    Calculate the expected value of a set of values given their probabilities.

    Args:
        values (list): A list of possible values.
        probabilities (list): A list of probabilities corresponding to the values.

    Returns:
        float: The expected value.
    """
    return sum(x * p for x, p in zip(values, probabilities))


def variance(values, mean):
    """
    Calculate the variance of a set of values.

    Args:
        values (list): A list of values.
        mean (float): The mean of the values.

    Returns:
        float: The variance of the values.
    """
    return sum((x - mean) ** 2 for x in values) / len(values)


def standard_deviation(variance):
    """
    Calculate the standard deviation from the variance.

    Args:
        variance (float): The variance.

    Returns:
        float: The standard deviation.
    """
    return variance**0.5


def value_at_risk(returns, confidence_level):
    """
    Calculate the Value at Risk (VaR) at a given confidence level.

    Args:
        returns (list): A list of returns.
        confidence_level (float): The confidence level (between 0 and 1).

    Returns:
        float: The VaR at the specified confidence level.
    """
    sorted_returns = sorted(returns)
    index = int((1 - confidence_level) * len(sorted_returns))
    return sorted_returns[index]


def conditional_value_at_risk(returns, confidence_level):
    """
    Calculate the Conditional Value at Risk (CVaR) at a given confidence level.

    Args:
        returns (list): A list of returns.
        confidence_level (float): The confidence level (between 0 and 1).

    Returns:
        float: The CVaR at the specified confidence level.
    """
    var = value_at_risk(returns, confidence_level)
    losses = [r for r in returns if r <= var]
    return sum(losses) / len(losses) if losses else 0
