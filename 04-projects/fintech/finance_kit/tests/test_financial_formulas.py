import pytest

from finance_kit.utils.financial_formulas import calculate_irr, calculate_npv


def test_calculate_npv():
    cash_flows = [-1000, 200, 300, 400, 500]
    discount_rate = 0.1
    npv = calculate_npv(cash_flows, discount_rate)
    expected_npv = 71.78  # Updated expected value
    assert pytest.approx(npv, rel=1e-2) == expected_npv


def test_calculate_npv_empty_cash_flows():
    with pytest.raises(ValueError, match="Cash flows list cannot be empty."):
        calculate_npv([], 0.1)


def test_calculate_npv_invalid_discount_rate():
    with pytest.raises(ValueError, match="Discount rate must be greater than -1."):
        calculate_npv([100, 200], -1.5)


def test_calculate_irr():
    cash_flows = [-1000, 300, 400, 500]
    irr = calculate_irr(cash_flows)
    expected_irr = 0.08896  # Update this value based on your calculation
    assert pytest.approx(irr, rel=1e-2) == expected_irr


def test_calculate_irr_insufficient_cash_flows():
    with pytest.raises(
        ValueError, match="At least two cash flows are required to calculate IRR."
    ):
        calculate_irr([100])


def test_calculate_irr_no_solution():
    with pytest.raises(ValueError, match="Unable to calculate IRR."):
        calculate_irr([100, 200, 300])  # All positive cash flows, should raise error


# Additional tests can be added here as more functions are implemented in financial_formulas.py
