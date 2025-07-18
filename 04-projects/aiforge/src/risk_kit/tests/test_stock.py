import pytest

from risk_kit.calculators.stock import volatility_risk


def test_calculate_stock_risk():
    sample_prices = [100, 102, 98, 103, 99, 101, 97, 105]
    risk = volatility_risk(sample_prices)

    # Check if the risk score is between 0 and 1
    assert 0 <= risk <= 1

    # Check if the risk score is close to an expected value
    # Note: This expected value is an approximation and may need adjustment
    assert pytest.approx(risk, abs=0.1) == 0.5


def test_insufficient_data():
    with pytest.raises(ValueError):
        volatility_risk([100])


def test_constant_prices():
    constant_prices = [100, 100, 100, 100, 100]
    risk = volatility_risk(constant_prices)
    assert risk == 0


def test_high_volatility():
    volatile_prices = [100, 150, 50, 200, 25]
    risk = volatility_risk(volatile_prices)
    assert risk == 1  # Should be maximum risk due to high volatility
