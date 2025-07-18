import numpy as np
import pytest

from risk_kit.finance import assess_risk, classify_risk


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
