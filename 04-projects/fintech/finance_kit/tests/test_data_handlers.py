import os
import tempfile

import pandas as pd
import pytest

from finance_kit.utils.data_handlers import calculate_returns, load_financial_data


@pytest.fixture
def sample_csv_file():
    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".csv") as tmp:
        tmp.write("Date,Price\n2021-01-01,100\n2021-01-02,102\n2021-01-03,98\n")
        tmp.flush()
        yield tmp.name
    os.unlink(tmp.name)


def test_load_financial_data(sample_csv_file):
    df = load_financial_data(sample_csv_file)
    assert isinstance(df, pd.DataFrame)
    assert df.shape == (3, 2)
    assert list(df.columns) == ["Date", "Price"]


def test_load_financial_data_file_not_found():
    with pytest.raises(FileNotFoundError):
        load_financial_data("non_existent_file.csv")


def test_load_financial_data_empty_file():
    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".csv") as tmp:
        tmp.write("")
        tmp.flush()

    with pytest.raises(pd.errors.EmptyDataError):
        load_financial_data(tmp.name)

    os.unlink(tmp.name)


def test_calculate_returns_list():
    prices = [100, 102, 98, 103]
    returns = calculate_returns(prices)
    expected_returns = [0.02, -0.0392156862745098, 0.05102040816326531]
    assert isinstance(returns, list)
    assert len(returns) == len(expected_returns)  # Check length
    assert all(pytest.approx(a) == b for a, b in zip(returns, expected_returns))


def test_calculate_returns_series():
    prices = pd.Series([100, 102, 98, 103])
    returns = calculate_returns(prices)
    expected_returns = [0.02, -0.0392156862745098, 0.05102040816326531]
    assert isinstance(returns, list)  # Ensure returns is a list
    assert len(returns) == len(prices) - 1
    assert all(pytest.approx(a) == b for a, b in zip(returns, expected_returns))


def test_calculate_returns_empty_input():
    with pytest.raises(ValueError, match="Input prices cannot be empty."):
        calculate_returns([])


def test_calculate_returns_non_numeric():
    with pytest.raises(ValueError, match="Input prices must be numeric."):
        calculate_returns(["a", "b", "c"])  # Non-numeric input should raise an error


# Additional tests can be added here as more functions are implemented in data_handlers.py
