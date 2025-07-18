# File: prism/collector/collector_yfinance.py

import yfinance as yf


def get_ticker_info(ticker_symbol):
    """
    Fetches the information for a given ticker symbol using yfinance.

    :param ticker_symbol: The ticker symbol of the company (e.g., "MSFT").
    :return: A dictionary containing the ticker information.
    """
    ticker = yf.Ticker(ticker_symbol)
    return ticker.info
