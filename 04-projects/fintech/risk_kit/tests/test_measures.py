import pytest

from risk_kit.measures import (
    conditional_value_at_risk,
    expected_value,
    standard_deviation,
    value_at_risk,
    variance,
)


def test_expected_value():
    values = [100, 200, 300]
    probabilities = [0.2, 0.5, 0.3]
    assert expected_value(values, probabilities) == 210.0  # Updated expected value


def test_variance():
    values = [100, 200, 300]
    mean = expected_value(values, [0.2, 0.5, 0.3])
    assert variance(values, mean) == 6766.666666666667


def test_standard_deviation():
    var = 6666.666666666667
    assert standard_deviation(var) == 81.64965809277261


def test_value_at_risk():
    returns = [-0.1, -0.2, -0.05, -0.15]
    assert value_at_risk(returns, 0.95) == -0.2


def test_conditional_value_at_risk():
    returns = [-0.1, -0.2, -0.05, -0.15]
    assert conditional_value_at_risk(returns, 0.95) == -0.2
