"""
This module contains tests for the company functionality of PRISM.
"""

import pytest

from research_kit.company import add_company, companies, gather_company_info


def test_add_company():
    """
    Test the add_company function to ensure it adds a company correctly.
    """
    # Clear the companies list before the test
    companies.clear()

    company_data = add_company("TechCorp", "Technology")

    assert company_data["name"] == "TechCorp"
    assert company_data["industry"] == "Technology"
    assert len(companies) == 1
    assert companies[0] == company_data


def test_add_duplicate_company():
    """
    Test that adding a duplicate company raises a ValueError.
    """
    # Clear the companies list before the test
    companies.clear()

    add_company("FinanceInc", "Finance")

    with pytest.raises(ValueError) as excinfo:
        add_company("FinanceInc", "Technology")

    assert str(excinfo.value) == "Company 'FinanceInc' already exists"
    assert len(companies) == 1


def test_gather_company_info():
    """
    Test the gather_company_info function to ensure it returns a valid company profile.
    """
    company_name = "TechCorp"
    company_industry = "Technology"

    profile = gather_company_info(company_name, company_industry)

    assert profile["name"] == company_name
    assert profile["industry"] == company_industry
    assert profile["revenue"].startswith("$")
    assert profile["employees"].isdigit()
    assert profile["founded"].isdigit()
    assert isinstance(profile["description"], str)
    assert company_name in profile["description"]
    assert company_industry in profile["description"]


def test_gather_company_info_different_inputs():
    """
    Test gather_company_info with different inputs to ensure it handles various cases.
    """
    companies = [
        ("FinanceInc", "Finance"),
        ("HealthCare Ltd", "Healthcare"),
        ("Green Energy Co", "Renewable Energy"),
    ]

    for name, industry in companies:
        profile = gather_company_info(name, industry)
        assert profile["name"] == name
        assert profile["industry"] == industry
        # Other assertions remain the same as in test_gather_company_info
