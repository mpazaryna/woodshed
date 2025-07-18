# woodshed/lab/pandas_example.py

"""
This module provides utility functions for basic DataFrame operations using pandas.
Functions include filtering data, adding columns, and calculating column means.
"""

import pandas as pd


def filter_data(df, column_name, threshold):
    """
    Filters the DataFrame to only include rows where the specified column's value is above the threshold.

    Parameters:
    df (pd.DataFrame): The DataFrame to filter.
    column_name (str): The name of the column to apply the filter on.
    threshold (int or float): The threshold value to filter the column.

    Returns:
    pd.DataFrame: A DataFrame containing only the rows where the column's value is above the threshold.

    Raises:
    ValueError: If the column does not exist in the DataFrame.
    TypeError: If the threshold is not a number.
    """
    if column_name not in df.columns:
        raise ValueError(f"Column '{column_name}' does not exist in DataFrame.")
    if not isinstance(threshold, (int, float)):
        raise TypeError("Threshold must be a number.")
    return df[df[column_name] > threshold]


def add_column(df, new_column_name, data):
    """
    Adds a new column to the DataFrame.

    Parameters:
    df (pd.DataFrame): The DataFrame to which the new column will be added.
    new_column_name (str): The name of the new column.
    data (list): The data for the new column, must match the length of the DataFrame.

    Returns:
    pd.DataFrame: The DataFrame with the new column added.

    Raises:
    ValueError: If the column already exists or if the length of data does not match the DataFrame.
    """
    if new_column_name in df.columns:
        raise ValueError(f"Column '{new_column_name}' already exists in DataFrame.")
    if len(data) != len(df):
        raise ValueError("Length of data does not match number of rows in DataFrame.")
    df[new_column_name] = data
    return df


def calculate_mean(df, column_name):
    """
    Calculates the mean of a specified column.

    Parameters:
    df (pd.DataFrame): The DataFrame containing the column.
    column_name (str): The name of the column to calculate the mean for.

    Returns:
    float: The mean of the column.

    Raises:
    ValueError: If the column does not exist in the DataFrame.
    """
    if column_name not in df.columns:
        raise ValueError(f"Column '{column_name}' does not exist in DataFrame.")
    return df[column_name].mean()


if __name__ == "__main__":
    # Create a simple DataFrame
    data = {"A": [1, 2, 3, 4, 5], "B": [5, 4, 3, 2, 1]}
    df = pd.DataFrame(data)

    # Filter the DataFrame
    filtered_df = filter_data(df, "A", 2)
    print("Filtered DataFrame:")
    print(filtered_df)

    # Add a new column
    df = add_column(df, "C", [10, 20, 30, 40, 50])
    print("\nDataFrame with new column:")
    print(df)

    # Calculate mean of a column
    mean_value = calculate_mean(df, "A")
    print(f"\nMean of column 'A': {mean_value}")
