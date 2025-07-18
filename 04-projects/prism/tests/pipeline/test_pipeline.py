"""
This module contains tests for the pipeline functionality of PRISM.
"""

import pytest  # noqa: F401

from research_kit.company import add_company
from research_kit.pipeline import run_pipeline


# Test cases for run_pipeline
def test_run_pipeline():
    """
    Test the function to ensure it runs the pipeline correctly.

    This test prepares test data, simulates an existing company,
    runs the pipeline, and checks the results against expected outcomes.
    """
    # Prepare test data
    test_companies = [
        {"name": "TechCorp", "industry": "Technology"},
        {"name": "ExistingCompany", "industry": "Finance"},
    ]

    # Add the existing company to simulate the ValueError
    add_company("ExistingCompany", "Finance")

    # Run the pipeline
    results = run_pipeline(test_companies)

    # Update the expected output based on the actual collected data
    expected_results = [
        {
            "name": "TechCorp",
            "status": "processed",
            "collected_data": {},  # Placeholder, we will check its structure
        },
        {
            "name": "ExistingCompany",
            "status": "error",
            "error_message": "Company 'ExistingCompany' already exists",  # Updated expected message
        },
    ]

    # Assert the results
    assert results[0]["name"] == expected_results[0]["name"]
    assert results[0]["status"] == expected_results[0]["status"]

    # Verify that collected_data is returned and has the expected structure
    collected_data = results[0]["collected_data"]
    assert collected_data is not None, "Collected data should not be None."
    assert isinstance(collected_data, dict), "Collected data should be a dictionary."
    assert (
        "market_trends" in collected_data
    ), "Collected data should contain 'market_trends'."
    assert isinstance(
        collected_data["market_trends"], list
    ), "'market_trends' should be a list."
    assert (
        len(collected_data["market_trends"]) > 0
    ), "'market_trends' should not be empty."

    assert results[1]["name"] == expected_results[1]["name"]
    assert results[1]["status"] == expected_results[1]["status"]
    assert results[1]["error_message"] == expected_results[1]["error_message"]
