"""
This module contains tests for the data collection functionality of PRISM.
"""

import os

import pytest
from requests.exceptions import RequestException, Timeout

from research_kit.collector.collector import (
    collect_all,
    collect_company_info,
    collect_industry_info,
    collect_market_trends,
)
from research_kit.collector.collector_perplexity import get_perplexity_response


def test_collect_company_info():
    """
    Test the collect_company_info function to ensure it returns valid company information.
    """
    company_name = "TechCorp"
    industry = "Technology"

    info = collect_company_info(company_name, industry)

    assert info["name"] == company_name
    assert info["industry"] == industry
    assert isinstance(info["revenue"], str) and info["revenue"].startswith("$")
    assert isinstance(info["employees"], int)
    assert isinstance(info["founded"], int)
    assert isinstance(info["description"], str)


def test_collect_industry_info():
    """
    Test the collect_industry_info function to ensure it returns valid industry information.
    """
    industry = "Technology"

    info = collect_industry_info(industry)

    assert info["name"] == industry
    assert isinstance(info["market_size"], str) and info["market_size"].startswith("$")
    assert isinstance(info["growth_rate"], str) and info["growth_rate"].endswith("%")
    assert isinstance(info["major_players"], list) and len(info["major_players"]) > 0


def test_collect_market_trends():
    """
    Test the collect_market_trends function to ensure it returns a list of trends.
    """
    industry = "Technology"

    trends = collect_market_trends(industry)

    assert isinstance(trends, list)
    assert len(trends) > 0
    assert all(isinstance(trend, str) for trend in trends)


def test_collect_all():
    """
    Test the collect_all function to ensure it returns comprehensive information.
    """
    company_name = "TechCorp"
    industry = "Technology"

    all_info = collect_all(company_name, industry)

    assert "company_info" in all_info
    assert "industry_info" in all_info
    assert "market_trends" in all_info
    assert all_info["company_info"]["name"] == company_name
    assert all_info["industry_info"]["name"] == industry
    assert isinstance(all_info["market_trends"], list)
