import numpy as np
import pytest

from finance_kit.core.ratios import calculate_roe


def test_calculate_roe():
    # Test case 1: Positive ROE
    assert np.isclose(calculate_roe(100000, 1000000), 0.1)

    # Test case 2: Negative ROE (company operating at a loss)
    assert np.isclose(calculate_roe(-50000, 500000), -0.1)

    # Test case 3: Zero ROE
    assert np.isclose(calculate_roe(0, 1000000), 0.0)


def test_calculate_roe_exceptions():
    # Test case 4: Zero shareholder equity
    with pytest.raises(ValueError):
        calculate_roe(100000, 0)

    # Test case 5: Negative shareholder equity
    with pytest.raises(ValueError):
        calculate_roe(100000, -500000)

    # Test case 6: Non-numeric input
    with pytest.raises(TypeError):
        calculate_roe("100000", 1000000)

    # Test case 7: Non-numeric input
    with pytest.raises(TypeError):
        calculate_roe(100000, "1000000")


def test_calculate_roe_edge_cases():
    # Test case 8: Very large numbers
    assert np.isclose(calculate_roe(1e12, 1e15), 0.001)

    # Test case 9: Very small numbers
    assert np.isclose(calculate_roe(1e-6, 1e-3), 0.001)


# Additional tests can be added here as more ratio functions are implemented
