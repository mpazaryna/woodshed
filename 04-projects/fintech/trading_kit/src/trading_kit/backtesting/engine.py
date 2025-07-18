from typing import Any, Callable, Dict

import pandas as pd

from trading_kit.exceptions import (
    InvalidDataError,
    InvalidThresholdError,
    TradingKitError,
)


def backtest_strategy(
    data: dict, strategy_func: Callable[..., Dict[str, Any]], **params
) -> dict:
    """
    Run backtest on the given strategy function.

    This function applies a trading strategy to historical market data to generate trading signals.
    The strategy function should take the market data and any additional parameters as input and return
    a series of signals indicating when to buy or sell.

    Parameters:
    - data (dict): A dictionary containing historical market data, including price information.
    - strategy_func (callable): A function that implements the trading strategy. It should accept the
      market data and any additional parameters defined in **params.
    - **params: Additional parameters to be passed to the strategy function.

    Returns:
    - dict: A dictionary containing the generated trading signals.
    """
    try:
        signals = strategy_func(data, **params)
        # ... additional backtesting logic ...
        return signals  # Placeholder for results
    except KeyError as e:
        raise InvalidDataError(f"Missing key in data - {e}")
    except TypeError as e:
        raise InvalidDataError(f"Incorrect data type - {e}")
    except Exception as e:
        raise TradingKitError(f"An unexpected error occurred: {e}")


def calculate_performance(results: dict) -> dict:
    """
    Calculate performance metrics from backtest results.

    This function computes various performance metrics based on the results of a backtest.
    Currently, it returns a placeholder Sharpe ratio, which is a measure of risk-adjusted return.

    Parameters:
    - results (dict): A dictionary containing the results of the backtest, including returns.

    Returns:
    - dict: A dictionary containing performance metrics, such as the Sharpe ratio.
    """
    try:
        returns = results.get("returns", [])
        if not returns:
            return {"sharpe_ratio": 0}

        mean_return = sum(returns) / len(returns)
        std_dev_return = (
            sum((x - mean_return) ** 2 for x in returns) / (len(returns) - 1)
        ) ** 0.5  # Using sample standard deviation
        sharpe_ratio = mean_return / std_dev_return if std_dev_return != 0 else 0

        return {"sharpe_ratio": sharpe_ratio}
    except KeyError as e:
        raise InvalidDataError(f"Missing key in results - {e}")
    except TypeError as e:
        raise InvalidDataError(f"Incorrect data type - {e}")
    except ZeroDivisionError as e:
        raise InvalidThresholdError(f"Division by zero - {e}")
    except Exception as e:
        raise TradingKitError(f"An unexpected error occurred: {e}")
