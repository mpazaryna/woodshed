"""
This module contains tests for the analysis functionality of PRISM.
"""

from research_kit.analysis import (
    analyze_company_financials,
    analyze_market_position,
    analyze_trends_impact,
    perform_comprehensive_analysis,
)


def test_analyze_company_financials():
    """
    Test the analyze_company_financials function to ensure it returns the expected structure.
    """
    company_info = {
        "name": "TechCorp",
        "industry": "Technology",
        "revenue": "$1,000,000",
        "employees": 100,
        "founded": 2010,
    }

    result = analyze_company_financials(company_info)

    assert "financial_health" in result
    assert "growth_potential" in result
    assert "risk_assessment" in result


def test_analyze_market_position():
    """
    Test the analyze_market_position function to ensure it returns the expected structure.
    """
    company_info = {"name": "TechCorp", "industry": "Technology"}
    industry_info = {
        "name": "Technology",
        "market_size": "$1,000,000,000",
        "growth_rate": "5.0%",
    }

    result = analyze_market_position(company_info, industry_info)

    assert "market_share" in result
    assert "competitive_advantage" in result
    assert "market_sentiment" in result


def test_analyze_trends_impact():
    """
    Test the analyze_trends_impact function to ensure it returns the expected structure.
    """
    company_info = {"name": "TechCorp", "industry": "Technology"}
    market_trends = ["Increasing adoption of AI", "Shift towards sustainable practices"]

    result = analyze_trends_impact(company_info, market_trends)

    assert "trend_alignment" in result
    assert "potential_opportunities" in result
    assert isinstance(result["potential_opportunities"], list)
    assert "potential_threats" in result
    assert isinstance(result["potential_threats"], list)


def test_perform_comprehensive_analysis():
    """
    Test the perform_comprehensive_analysis function to ensure it returns the expected structure.
    """
    collected_data = {
        "company_info": {
            "name": "TechCorp",
            "industry": "Technology",
            "revenue": "$1,000,000",
            "employees": 100,
            "founded": 2010,
        },
        "industry_info": {
            "name": "Technology",
            "market_size": "$1,000,000,000",
            "growth_rate": "5.0%",
        },
        "market_trends": [
            "Increasing adoption of AI",
            "Shift towards sustainable practices",
        ],
    }

    result = perform_comprehensive_analysis(collected_data)

    assert "financial_analysis" in result
    assert "market_position" in result
    assert "trends_impact" in result
    assert "overall_outlook" in result
