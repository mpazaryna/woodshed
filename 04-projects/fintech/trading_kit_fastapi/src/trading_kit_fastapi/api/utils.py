"""
Utility functions for data conversion and handling NaN values.

This module provides utility functions to convert pandas Series to dictionaries while handling NaN values.
Converting pandas Series to dictionaries is important for several reasons:

1. **Serialization**: Dictionaries are a standard data structure that can be easily serialized to JSON, making them suitable for APIs and data interchange formats.
2. **Compatibility**: Many web frameworks and libraries expect data in dictionary format, so converting pandas Series to dictionaries ensures compatibility.
3. **Readability**: Dictionaries with string keys (e.g., date strings) are often more readable and easier to work with than pandas Series, especially when dealing with time series data.
4. **Flexibility**: Converting to dictionaries allows for more flexible data manipulation and integration with other parts of the application.

Functions:
    - nan_to_none: Convert NaN values to None.
    - to_dict_with_nan: Convert a pandas Series to a dictionary, handling NaN values.
    - to_signal_dict_with_nan: Convert a pandas Series of signals to a dictionary, handling NaN values.
"""

from typing import Any, Dict, Optional

import numpy as np
import pandas as pd


def to_dict_with_nan(data: pd.Series) -> Dict[str, Optional[float]]:
    """
    Convert a pandas Series to a dictionary, handling NaN values.

    This function takes a pandas Series with datetime indices and float values, and converts it
    to a dictionary. The keys of the dictionary are date strings in 'YYYY-MM-DD' format, and the
    values are either floats or None if the original value was NaN. This is useful for serializing
    time series data for APIs or other data interchange formats.

    Args:
        data (pd.Series): The pandas Series to convert. The index should be datetime objects,
                          and the values should be floats.

    Returns:
        Dict[str, Optional[float]]: A dictionary where the keys are date strings in 'YYYY-MM-DD' format
                                    and the values are either floats or None if the original value was NaN.

    Examples:
        >>> data = pd.Series([1.0, np.nan, 2.5], index=pd.to_datetime(['2023-01-01', '2023-01-02', '2023-01-03']))
        >>> to_dict_with_nan(data)
        {'2023-01-01': 1.0, '2023-01-02': None, '2023-01-03': 2.5}
    """
    return {
        date.strftime("%Y-%m-%d"): nan_to_none(value) for date, value in data.items()
    }


def to_signal_dict_with_nan(data: pd.Series) -> Dict[str, Optional[int]]:
    """
    Convert a pandas Series of signals to a dictionary, handling NaN values.

    This function takes a pandas Series with datetime indices and integer values (or NaN), and converts
    it to a dictionary. The keys of the dictionary are date strings in 'YYYY-MM-DD' format, and the values
    are either integers or None if the original value was NaN. This is useful for serializing signal data
    for APIs or other data interchange formats.

    Args:
        data (pd.Series): The pandas Series to convert. The index should be datetime objects,
                          and the values should be integers or NaN.

    Returns:
        Dict[str, Optional[int]]: A dictionary where the keys are date strings in 'YYYY-MM-DD' format
                                  and the values are either integers or None if the original value was NaN.

    Examples:
        >>> data = pd.Series([1, np.nan, -1], index=pd.to_datetime(['2023-01-01', '2023-01-02', '2023-01-03']))
        >>> to_signal_dict_with_nan(data)
        {'2023-01-01': 1, '2023-01-02': None, '2023-01-03': -1}
    """
    return {
        date.strftime("%Y-%m-%d"): nan_to_none(
            int(value) if not np.isnan(value) else None
        )
        for date, value in data.items()
    }


def nan_to_none(value: Any) -> Optional[Any]:
    """
    Convert NaN values to None.

    This function checks if the provided value is NaN (Not a Number) and converts it to None.
    This is useful when dealing with data that may contain missing or undefined values,
    which are often represented as NaN in numerical computations.

    Args:
        value (Any): The value to check. This can be of any type, but typically it is a float.

    Returns:
        Optional[Any]: None if the value is NaN, otherwise the value itself.

    Examples:
        >>> nan_to_none(np.nan)
        None
        >>> nan_to_none(3.14)
        3.14
        >>> nan_to_none("string")
        'string'
    """
    try:
        return None if np.isnan(value) else value
    except TypeError:
        return value
