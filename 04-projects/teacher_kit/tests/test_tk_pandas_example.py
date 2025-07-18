"""
This module contains unit tests for the pandas_example module.
Tests include checking the functionality of filtering data, adding columns, and calculating column means.
"""

import pandas as pd
import pytest

from teacher_kit.lab.pandas_example import add_column, calculate_mean, filter_data


def test_filter_data():
    """
    Test filtering data with a valid column and threshold.
    """
    data = {"A": [1, 2, 3, 4, 5], "B": [5, 4, 3, 2, 1]}
    df = pd.DataFrame(data)
    result = filter_data(df, "A", 2).reset_index(drop=True)
    expected_data = {"A": [3, 4, 5], "B": [3, 2, 1]}
    expected_df = pd.DataFrame(expected_data)
    pd.testing.assert_frame_equal(result, expected_df)


def test_filter_data_invalid_column():
    """
    Test filtering data with an invalid column name.
    """
    data = {"A": [1, 2, 3], "B": [4, 5, 6]}
    df = pd.DataFrame(data)
    with pytest.raises(ValueError):
        filter_data(df, "C", 2)


def test_add_column():
    """
    Test adding a new column with valid data.
    """
    data = {"A": [1, 2, 3]}
    df = pd.DataFrame(data)
    result = add_column(df, "B", [4, 5, 6])
    expected_data = {"A": [1, 2, 3], "B": [4, 5, 6]}
    expected_df = pd.DataFrame(expected_data)
    pd.testing.assert_frame_equal(result, expected_df)


def test_add_column_existing():
    """
    Test adding a column that already exists.
    """
    data = {"A": [1, 2, 3]}
    df = pd.DataFrame(data)
    with pytest.raises(ValueError):
        add_column(df, "A", [4, 5, 6])


def test_add_column_length_mismatch():
    """
    Test adding a column with data length mismatch.
    """
    data = {"A": [1, 2, 3]}
    df = pd.DataFrame(data)
    with pytest.raises(ValueError):
        add_column(df, "B", [4, 5])


def test_calculate_mean():
    """
    Test calculating the mean of a valid column.
    """
    data = {"A": [1, 2, 3, 4, 5]}
    df = pd.DataFrame(data)
    result = calculate_mean(df, "A")
    assert result == 3.0


def test_calculate_mean_invalid_column():
    """
    Test calculating the mean of an invalid column.
    """
    data = {"A": [1, 2, 3]}
    df = pd.DataFrame(data)
    with pytest.raises(ValueError):
        calculate_mean(df, "B")
