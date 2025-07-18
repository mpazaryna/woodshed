"""
This module contains the main pipeline functionality for PRISM.
"""

from typing import Any, Dict, List

from research_kit.analysis import perform_comprehensive_analysis
from research_kit.collector.collector import collect_all
from research_kit.company import add_company
from research_kit.reporting import generate_full_report
from research_kit.utils.error_handling import (
    AnalysisError,
    DataCollectionError,
    ReportingError,
    handle_errors,
    safe_execute,
)
from research_kit.utils.logging import log_function_call, pipeline_logger


@handle_errors
@log_function_call(pipeline_logger)
def run_pipeline(company_data: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    """
    Run the PRISM pipeline on a list of company data.

    This function represents the main pipeline of PRISM. It collects comprehensive
    information about each company and its industry, performs analysis, and generates a report.

    Args:
    company_data (List[Dict[str, str]]): A list of dictionaries containing company
    name and industry.

    Returns:
    List[Dict[str, Any]]: A list of processed company profiles with comprehensive information, analysis, and report.
    """
    results = []
    for company in company_data:
        pipeline_logger.info(f"Processing company: {company['name']}")
        try:
            # Add company to the system
            add_company(company["name"], company["industry"])

            # Collect comprehensive information
            collected_data = safe_execute(
                collect_all, company["name"], company["industry"]
            )
            if collected_data is None:
                raise DataCollectionError(
                    f"Failed to collect data for {company['name']}"
                )

            # Perform analysis
            analysis_result = safe_execute(
                perform_comprehensive_analysis, collected_data
            )
            if analysis_result is None:
                raise AnalysisError(f"Failed to analyze data for {company['name']}")

            # Generate report
            report = safe_execute(
                generate_full_report, collected_data["company_info"], analysis_result
            )
            if report is None:
                raise ReportingError(f"Failed to generate report for {company['name']}")

            # Combine information and mark as processed
            processed_company = {
                "name": company["name"],
                "status": "processed",
                "collected_data": collected_data,
                "analysis_result": analysis_result,
                "report": report,
            }
            results.append(processed_company)
            pipeline_logger.info(f"Successfully processed company: {company['name']}")
        except Exception as e:
            pipeline_logger.error(
                f"Error processing company {company['name']}: {str(e)}"
            )
            results.append(
                {"name": company["name"], "status": "error", "error_message": str(e)}
            )
    return results


if __name__ == "__main__":
    # This allows you to run some test code when the file is executed directly
    test_companies = [
        {"name": "TechCorp", "industry": "Technology"},
        {"name": "FinanceInc", "industry": "Finance"},
        {"name": "HealthCare Ltd", "industry": "Healthcare"},
    ]
    pipeline_logger.info("Starting pipeline execution")
    result = run_pipeline(test_companies)
    pipeline_logger.info(f"Pipeline completed. Processed {len(result)} companies.")
