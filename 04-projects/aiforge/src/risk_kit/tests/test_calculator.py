# src/risk_kit/tests/test_calculator.py

import pytest

from risk_kit.calculator import Calculator


def test_calculator():
    # Test for risk calculator
    risk_calculator = Calculator.get("risk")
    assert "assess_risk" in risk_calculator
    assert "classify_risk" in risk_calculator

    # Test for mortgage calculator
    mortgage_calculator = Calculator.get("mortgage")
    assert "assess_mortgage_eligibility" in mortgage_calculator

    # Test for unknown calculator type
    with pytest.raises(ValueError, match="Unknown calculator type: unknown"):
        Calculator.get("unknown")
