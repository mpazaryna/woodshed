import numpy as np


# Function to assess risk based on individual parameters
def assess_risk(annual_income, credit_score, debt_to_income):
    if annual_income < 40000 or credit_score < 650 or debt_to_income > 0.4:
        return 1  # High risk
    return 0  # Low risk


# Create risk classification using assess_risk
def classify_risk(data):
    return np.array([assess_risk(row[0], row[1], row[2]) for row in data])
