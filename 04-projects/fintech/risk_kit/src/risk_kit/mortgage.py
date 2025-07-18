"""
Module for calculating mortgage risk based on loan amount and property value.
"""

import math


def calculate_mortgage_risk(loan_amount, property_value):
    """
    Calculate the mortgage risk score based on the loan amount and property value.

    Parameters:
    loan_amount (float): The amount of the loan.
    property_value (float): The value of the property.

    Returns:
    int: A risk score from 1 to 4 based on the loan-to-value ratio.

    Raises:
    ValueError: If the property value is less than or equal to zero.
    """
    if property_value <= 0:
        raise ValueError("Property value must be greater than zero")

    ltv_ratio = (loan_amount / property_value) * 100

    if ltv_ratio <= 80:
        risk_score = 1
    elif 80 < ltv_ratio <= 90:
        risk_score = 2
    elif 90 < ltv_ratio <= 95:
        risk_score = 3
    else:
        risk_score = 4

    return risk_score


def assess_mortgage_eligibility(annual_income, credit_score, down_payment, home_price):
    """
    Assess mortgage eligibility based on income, credit score, and down payment.

    Parameters:
    annual_income (float): The annual income of the individual.
    credit_score (int): The credit score of the individual.
    down_payment (float): The down payment amount.
    home_price (float): The price of the home.

    Returns:
    bool: True if eligible for a mortgage, False otherwise.
    """
    required_income = home_price * 0.2  # 20% of home price
    required_down_payment = home_price * 0.1  # 10% of home price

    # Check eligibility conditions
    if (
        annual_income >= required_income
        and credit_score >= 650
        and down_payment >= required_down_payment
    ):
        return True  # Eligible
    return False  # Not eligible
