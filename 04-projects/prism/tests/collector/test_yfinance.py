# File: tests/test_collector_yfinance.py

import pytest

from research_kit.collector.collector_yfinance import get_ticker_info


@pytest.mark.integration
def test_get_ticker_info():
    """
    Integration test for get_ticker_info function.
    """
    ticker_symbol = "MSFT"
    info = get_ticker_info(ticker_symbol)

    # Check if the info is a dictionary and contains expected keys
    assert isinstance(info, dict)
    assert "symbol" in info
    assert info["symbol"] == ticker_symbol
