import numpy as np
import pytest

from risk_kit.calculators.finance_assessor import assess_risk, classify_risk
from risk_kit.calculators.finance_mortgage import assess_mortgage_eligibility


def test_assess_risk():
    assert assess_risk(30000, 600, 0.5) == 1  # High risk
    assert assess_risk(50000, 700, 0.3) == 0  # Low risk
    assert assess_risk(40000, 650, 0.4) == 0  # Low risk
    assert assess_risk(35000, 720, 0.2) == 1  # High risk


def test_classify_risk_small_dataset():
    # Create a small synthetic dataset
    small_data = np.array(
        [[30000, 600, 0.5], [50000, 700, 0.3], [40000, 650, 0.4], [35000, 720, 0.2]]
    )

    # Classify risk
    risk_classes = classify_risk(small_data)

    # Check the output shape
    assert risk_classes.shape == (4,)  # Ensure it matches the number of samples
    # Check expected risk classifications
    assert np.array_equal(risk_classes, np.array([1, 0, 0, 1]))  # Expected results


@pytest.mark.parametrize(
    "annual_income, credit_score, down_payment, expected",
    [
        (110000, 720, 60000, True),  # Meets all criteria
        (
            90000,
            680,
            40000,
            False,
        ),  # Meets income and down payment, but credit score is too low
        (150000, 700, 70000, True),  # Exceeds all criteria
        (
            95000,
            650,
            50000,
            False,
        ),  # Meets minimum criteria, but income is slightly low
    ],
)
def test_assess_mortgage_eligibility(
    annual_income, credit_score, down_payment, expected
):
    result = assess_mortgage_eligibility(annual_income, credit_score, down_payment)
    print(f"Input: income={annual_income}, credit={credit_score}, down={down_payment}")
    print(f"Expected: {expected}, Got: {result}")
    assert (
        result == expected
    ), f"Failed for input: income={annual_income}, credit={credit_score}, down={down_payment}"
