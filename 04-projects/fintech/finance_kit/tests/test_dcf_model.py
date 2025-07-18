import numpy as np
import pytest

from finance_kit.models.dcf_model import DCFModel


@pytest.fixture
def sample_dcf_model():
    cash_flows = [100, 120, 140, 160, 180]
    discount_rate = 0.1
    terminal_growth_rate = 0.02
    return DCFModel(cash_flows, discount_rate, terminal_growth_rate)


def test_dcf_model_initialization(sample_dcf_model):
    assert sample_dcf_model.cash_flows == [100, 120, 140, 160, 180]
    assert sample_dcf_model.discount_rate == 0.1
    assert sample_dcf_model.terminal_growth_rate == 0.02


def test_dcf_model_initialization_errors():
    with pytest.raises(ValueError):
        DCFModel([], 0.1, 0.02)  # Empty cash flows
    with pytest.raises(ValueError):
        DCFModel([100, 120], 0, 0.02)  # Invalid discount rate
    with pytest.raises(ValueError):
        DCFModel([100, 120], 0.1, 0.2)  # Terminal growth rate >= discount rate


def test_calculate_npv(sample_dcf_model):
    expected_npv = 516.31  # Corrected value
    assert np.isclose(sample_dcf_model.calculate_npv(), expected_npv, rtol=1e-2)


def test_calculate_terminal_value(sample_dcf_model):
    expected_terminal_value = 1413.62  # Calculated manually
    assert np.isclose(
        sample_dcf_model.calculate_terminal_value(), expected_terminal_value, rtol=1e-2
    )


def test_calculate_firm_value(sample_dcf_model):
    expected_firm_value = 1929.93  # NPV + Terminal Value (corrected)
    assert np.isclose(
        sample_dcf_model.calculate_firm_value(), expected_firm_value, rtol=1e-2
    )


def test_calculate_present_value_factor(sample_dcf_model):
    assert np.isclose(
        sample_dcf_model.calculate_present_value_factor(1), 0.9091, rtol=1e-4
    )
    assert np.isclose(
        sample_dcf_model.calculate_present_value_factor(5), 0.6209, rtol=1e-4
    )


def test_sensitivity_analysis(sample_dcf_model):
    discount_rates = [0.08, 0.09, 0.10, 0.11, 0.12]
    growth_rates = [0.01, 0.02, 0.03]

    results = sample_dcf_model.sensitivity_analysis(discount_rates, growth_rates)

    assert results.shape == (5, 3)
    assert np.all(results > 0)
    assert np.all(
        np.diff(results, axis=0) < 0
    )  # Values decrease as discount rate increases
    assert np.all(
        np.diff(results, axis=1) > 0
    )  # Values increase as growth rate increases


# Additional tests can be added here as more features are implemented in the DCF model
