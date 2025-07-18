"""
This module contains tests for the reporting functionality of PRISM.
"""

from research_kit.reporting import (
    generate_executive_summary,
    generate_financial_section,
    generate_full_report,
    generate_market_position_section,
    generate_trends_section,
)


def test_generate_executive_summary():
    """
    Test the generate_executive_summary function to ensure it returns the expected structure.
    """
    company_data = {"name": "TechCorp", "industry": "Technology"}
    analysis_result = {"overall_outlook": "positive"}

    summary = generate_executive_summary(company_data, analysis_result)

    assert "title" in summary
    assert "content" in summary
    assert isinstance(summary["content"], str)


def test_generate_financial_section():
    """
    Test the generate_financial_section function to ensure it returns the expected structure.
    """
    company_data = {"name": "TechCorp"}
    financial_analysis = {
        "financial_health": "stable",
        "growth_potential": "high",
        "risk_assessment": "low",
    }

    section = generate_financial_section(company_data, financial_analysis)

    assert "title" in section
    assert "content" in section
    assert isinstance(section["content"], str)
    assert "financial health" in section["content"].lower()
    assert "growth potential" in section["content"].lower()
    assert "risk assessment" in section["content"].lower()


def test_generate_market_position_section():
    """
    Test the generate_market_position_section function to ensure it returns the expected structure.
    """
    market_position = {
        "market_share": "growing",
        "competitive_advantage": "strong",
        "market_sentiment": "positive",
    }

    section = generate_market_position_section(market_position)

    assert "title" in section
    assert "content" in section
    assert isinstance(section["content"], str)
    assert "market share" in section["content"].lower()
    assert "competitive advantage" in section["content"].lower()
    assert "market sentiment" in section["content"].lower()


def test_generate_trends_section():
    """
    Test the generate_trends_section function to ensure it returns the expected structure.
    """
    trends_impact = {
        "trend_alignment": "high",
        "potential_opportunities": ["AI adoption", "Global expansion"],
        "potential_threats": ["Increasing competition"],
    }

    section = generate_trends_section(trends_impact)

    assert "title" in section
    assert "content" in section
    assert isinstance(section["content"], str)
    assert "trend alignment" in section["content"].lower()
    assert "potential opportunities" in section["content"].lower()
    assert "potential threats" in section["content"].lower()


def test_generate_full_report():
    """
    Test the generate_full_report function to ensure it returns the expected structure.
    """
    company_data = {"name": "TechCorp", "industry": "Technology"}
    analysis_result = {
        "overall_outlook": "positive",
        "financial_analysis": {
            "financial_health": "stable",
            "growth_potential": "high",
            "risk_assessment": "low",
        },
        "market_position": {
            "market_share": "growing",
            "competitive_advantage": "strong",
            "market_sentiment": "positive",
        },
        "trends_impact": {
            "trend_alignment": "high",
            "potential_opportunities": ["AI adoption", "Global expansion"],
            "potential_threats": ["Increasing competition"],
        },
    }

    report = generate_full_report(company_data, analysis_result)

    assert "company_name" in report
    assert "industry" in report
    assert "sections" in report
    assert isinstance(report["sections"], list)
    assert (
        len(report["sections"]) == 4
    )  # Executive Summary, Financial, Market Position, Trends
    for section in report["sections"]:
        assert "title" in section
        assert "content" in section
