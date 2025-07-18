"""
This module provides functions for generating reports based on collected and analyzed data in PRISM.
"""

from typing import Any, Dict

ReportSection = Dict[str, str]
Report = Dict[str, Any]


def generate_executive_summary(
    company_data: Dict[str, Any], analysis_result: Dict[str, Any]
) -> ReportSection:
    """
    Generate an executive summary of the company analysis.

    Args:
    company_data (Dict[str, Any]): Collected information about the company.
    analysis_result (Dict[str, Any]): Results of the comprehensive analysis.

    Returns:
    ReportSection: A summary of key findings and overall outlook.
    """
    return {
        "title": "Executive Summary",
        "content": f"Company {company_data['name']} shows {analysis_result['overall_outlook']} prospects in the {company_data['industry']} industry.",
    }


def generate_financial_section(
    company_data: Dict[str, Any], financial_analysis: Dict[str, Any]
) -> ReportSection:
    """
    Generate a report section on the company's financial analysis.

    Args:
    company_data (Dict[str, Any]): Collected information about the company.
    financial_analysis (Dict[str, Any]): Results of the financial analysis.

    Returns:
    ReportSection: A summary of the company's financial health and prospects.
    """
    return {
        "title": "Financial Analysis",
        "content": f"Financial health: {financial_analysis['financial_health']}\n"
        f"Growth potential: {financial_analysis['growth_potential']}\n"
        f"Risk assessment: {financial_analysis['risk_assessment']}",
    }


def generate_market_position_section(market_position: Dict[str, Any]) -> ReportSection:
    """
    Generate a report section on the company's market position.

    Args:
    market_position (Dict[str, Any]): Analysis of the company's market position.

    Returns:
    ReportSection: A summary of the company's standing in the market.
    """
    return {
        "title": "Market Position",
        "content": f"Market share: {market_position['market_share']}\n"
        f"Competitive advantage: {market_position['competitive_advantage']}\n"
        f"Market sentiment: {market_position['market_sentiment']}",
    }


def generate_trends_section(trends_impact: Dict[str, Any]) -> ReportSection:
    """
    Generate a report section on market trends and their impact.

    Args:
    trends_impact (Dict[str, Any]): Analysis of market trends' impact on the company.

    Returns:
    ReportSection: A summary of relevant market trends and their potential effects.
    """
    opportunities = ", ".join(trends_impact["potential_opportunities"])
    threats = ", ".join(trends_impact["potential_threats"])
    return {
        "title": "Market Trends and Impact",
        "content": f"Trend alignment: {trends_impact['trend_alignment']}\n"
        f"Potential opportunities: {opportunities}\n"
        f"Potential threats: {threats}",
    }


def generate_full_report(
    company_data: Dict[str, Any], analysis_result: Dict[str, Any]
) -> Report:
    """
    Generate a full report combining all sections.

    Args:
    company_data (Dict[str, Any]): Collected information about the company.
    analysis_result (Dict[str, Any]): Results of the comprehensive analysis.

    Returns:
    Report: A complete report with all sections.
    """
    return {
        "company_name": company_data["name"],
        "industry": company_data["industry"],
        "sections": [
            generate_executive_summary(company_data, analysis_result),
            generate_financial_section(
                company_data, analysis_result["financial_analysis"]
            ),
            generate_market_position_section(analysis_result["market_position"]),
            generate_trends_section(analysis_result["trends_impact"]),
        ],
    }


def generate_perplexity_section(content: str) -> ReportSection:
    """
    Generate a report section on perplexity research.

    Args:
    content (str): The content of the perplexity research.

    Returns:
    ReportSection: A section with the title and content of the perplexity research.
    """
    return {
        "title": "Perplexity Research",
        "content": content,
    }
