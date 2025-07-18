"""
This module provides a command-line interface for running the risk assessment model.
Currently, it supports a mortgage calculator to assess mortgage eligibility based on user inputs.
"""

import argparse
import logging

from risk_kit.calculator import Calculator
from risk_kit.config import config


def main():
    """
    Main function to execute the mortgage eligibility assessment.
    It sets up logging, parses command-line arguments, and evaluates mortgage eligibility.
    """
    # Setup logging
    config.ensure_directories_exist()
    config.setup_logging()

    logger = logging.getLogger(__name__)
    logger.info("Starting the mortgage eligibility assessment model.")

    parser = argparse.ArgumentParser(
        description="Run the mortgage eligibility assessment model."
    )
    parser.add_argument(
        "--evaluate", action="store_true", help="Evaluate the mortgage eligibility"
    )
    # Removed the risk calculator option
    parser.add_argument(
        "--calculator",
        default="mortgage",  # Set default to mortgage
        help="Type of calculator to use",
    )
    # Removed unused 'args' variable

    # Mortgage assessment logic
    annual_income = 80000
    credit_score = 720
    down_payment = 100000

    mortgage_calculator = Calculator.get("mortgage")
    eligible = mortgage_calculator["assess_mortgage_eligibility"](
        annual_income, credit_score, down_payment
    )
    logger.info(f"Mortgage eligibility: {'Eligible' if eligible else 'Not eligible'}")

    logger.info("Mortgage eligibility assessment execution completed.")


if __name__ == "__main__":
    main()
