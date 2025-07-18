import math

import pytest

from risk_kit.stock import volatility_risk


def test_calculate_stock_risk():
    """Test the calculation of stock risk based on sample prices."""
    sample_prices = [100, 102, 98, 103, 99, 101, 97, 105]
    risk = volatility_risk(sample_prices)
    assert 0 <= risk <= 1
    assert pytest.approx(risk, abs=0.1) == 0.5


def test_insufficient_data():
    """Test that ValueError is raised when insufficient data is provided."""
    with pytest.raises(ValueError):
        volatility_risk([100])


def test_constant_prices():
    """Test the risk calculation for constant prices, expecting a risk of 0."""
    constant_prices = [100, 100, 100, 100, 100]
    risk = volatility_risk(constant_prices)
    assert risk == 0


def test_high_volatility():
    """Test the risk calculation for highly volatile prices, expecting maximum risk."""
    volatile_prices = [100, 150, 50, 200, 25]
    risk = volatility_risk(volatile_prices)
    assert risk == 1  # Should be maximum risk due to high volatility
