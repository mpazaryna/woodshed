"""
Module for assessing financial risk and mortgage eligibility.

This module contains functions to assess individual risk based on income,
credit score, and debt-to-income ratio, classify risk for a dataset, and
determine mortgage eligibility based on income, credit score, and down payment.
"""

import numpy as np


# Function to assess risk based on individual parameters
def assess_risk(annual_income, credit_score, debt_to_income):
    """
    Assess the risk level based on annual income, credit score, and debt-to-income ratio.

    Parameters:
    annual_income (float): The annual income of the individual.
    credit_score (int): The credit score of the individual.
    debt_to_income (float): The debt-to-income ratio of the individual.

    Returns:
    int: 1 if high risk, 0 if low risk.
    """
    if annual_income < 40000 or credit_score < 650 or debt_to_income > 0.4:
        return 1  # High risk
    return 0  # Low risk


# Create risk classification using assess_risk
def classify_risk(data):
    """
    Classify risk for a dataset using the assess_risk function.

    Parameters:
    data (list of lists): A list where each sublist contains [annual_income, credit_score, debt_to_income].

    Returns:
    numpy.ndarray: An array of risk classifications (0 or 1) for each entry in the dataset.
    """
    return np.array([assess_risk(row[0], row[1], row[2]) for row in data])
