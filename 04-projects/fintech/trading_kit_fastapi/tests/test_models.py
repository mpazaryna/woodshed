"""
Unit tests for the StockData and AnalysisResult models.

This module contains tests to validate the behavior and constraints of the StockData and AnalysisResult models
defined in the trading_kit_fastapi.api.models module. The tests ensure that the models correctly handle valid
and invalid data, raising appropriate validation errors when necessary.

Tests included:
- test_stock_data_model: Validates the StockData model.
- test_analysis_result_model: Validates the AnalysisResult model.
"""

import pytest
from pydantic import ValidationError

from trading_kit_fastapi.api.models import StockData


def test_stock_data_model():
    """
    Test the StockData model with both valid and invalid data.

    This test performs the following checks:
    1. Validates that a StockData instance can be created with valid data.
    2. Asserts that the attributes of the created StockData instance match the input data.
    3. Ensures that a ValidationError is raised when invalid data is provided for the 'prices' field.

    Valid data example:
    - company_name: "Test Company"
    - dates: ["2023-01-01", "2023-01-02"]
    - prices: [100.0, 101.0]
    - short_window: 10
    - long_window: 30
    - precision: 2

    Invalid data example:
    - prices: ["invalid_price"] (should raise ValidationError)

    Steps:
    1. Create a valid StockData instance and assert its attributes.
    2. Attempt to create an invalid StockData instance and assert that a ValidationError is raised.
    """
    valid_data = {
        "company_name": "Test Company",
        "dates": ["2023-01-01", "2023-01-02"],
        "prices": [100.0, 101.0],
        "short_window": 10,
        "long_window": 30,
        "precision": 2,
    }

    # Test valid data
    stock_data = StockData(**valid_data)
    assert stock_data.company_name == "Test Company"
    assert stock_data.dates == ["2023-01-01", "2023-01-02"]
    assert stock_data.prices == [100.0, 101.0]
    assert stock_data.short_window == 10
    assert stock_data.long_window == 30
    assert stock_data.precision == 2

    # Test invalid data
    invalid_data = valid_data.copy()
    invalid_data["prices"] = ["invalid_price"]
    with pytest.raises(ValidationError):
        StockData(**invalid_data)
