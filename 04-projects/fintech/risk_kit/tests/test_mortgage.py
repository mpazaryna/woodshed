import pytest

from risk_kit.mortgage import assess_mortgage_eligibility, calculate_mortgage_risk


def test_calculate_mortgage_risk():
    # Test low risk scenario
    assert calculate_mortgage_risk(160000, 200000) == 1

    # Test medium-low risk scenario
    assert calculate_mortgage_risk(170000, 200000) == 2

    # Test medium-high risk scenario
    assert calculate_mortgage_risk(185000, 200000) == 3

    # Test high risk scenario
    assert calculate_mortgage_risk(195000, 200000) == 4

    # Test edge cases
    assert calculate_mortgage_risk(0, 100000) == 1
    assert calculate_mortgage_risk(100000, 100000) == 4

    # Test error case
    with pytest.raises(ValueError):
        calculate_mortgage_risk(100000, 0)


def test_assess_mortgage_eligibility():
    # Test eligibility scenario
    assert assess_mortgage_eligibility(180000, 700, 50000, 500000) is True
    assert assess_mortgage_eligibility(30000, 600, 20000, 500000) is False
