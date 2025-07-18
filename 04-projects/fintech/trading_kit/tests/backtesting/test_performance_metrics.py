import numpy as np
import pytest

from trading_kit.backtesting.performance_metrics import sharpe_ratio


def test_sharpe_ratio():
    # Example real-world data (daily returns of a hypothetical asset)
    returns = [0.01, 0.02, -0.01, 0.03, 0.04, -0.02, 0.01, 0.02, 0.03, -0.01]

    # Calculate Sharpe Ratio with a risk-free rate of 0.01
    risk_free_rate = 0.01
    excess_returns = np.array(returns) - risk_free_rate
    expected_sharpe_ratio = np.mean(excess_returns) / np.std(excess_returns)

    # Assert the calculated Sharpe Ratio is as expected
    assert np.isclose(
        sharpe_ratio(returns, risk_free_rate), expected_sharpe_ratio, atol=1e-6
    )


if __name__ == "__main__":
    pytest.main()
