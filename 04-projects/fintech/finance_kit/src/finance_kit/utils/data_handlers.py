from typing import List, Union

import pandas as pd


def load_financial_data(file_path: str) -> pd.DataFrame:
    """
    Load financial data from a CSV file into a pandas DataFrame.

    Args:
        file_path (str): Path to the CSV file containing financial data.

    Returns:
        pd.DataFrame: DataFrame containing the loaded financial data.

    Raises:
        FileNotFoundError: If the specified file is not found.
        pd.errors.EmptyDataError: If the file is empty.
    """
    try:
        df = pd.read_csv(file_path)
        if df.empty:
            raise pd.errors.EmptyDataError("The file is empty.")
        return df
    except FileNotFoundError:
        raise FileNotFoundError(f"The file {file_path} was not found.")


def calculate_returns(prices):
    """
    Calculate the returns from a list or Series of prices.

    Args:
        prices (list or pd.Series): List or Series of prices.

    Returns:
        list: Returns as a list.

    Raises:
        ValueError: If input prices are non-numeric or empty.
    """
    # Convert to pandas Series
    prices_series = pd.Series(prices)

    # Check if the Series is empty
    if prices_series.empty:
        raise ValueError("Input prices cannot be empty.")

    # Convert to numeric, forcing non-numeric to NaN
    prices_series = pd.to_numeric(prices_series, errors="coerce")

    # Check for NaN values
    if prices_series.isnull().any():
        raise ValueError("Input prices must be numeric and cannot contain NaN values.")

    # Calculate returns
    returns = (
        prices_series.pct_change().dropna()
    )  # Calculate percentage change and drop NaN
    return returns.tolist()  # Convert to list


# Additional data handling functions can be added here
