# src/risk_kit/financial_calculator_mortgage.py


def assess_mortgage_eligibility(annual_income, credit_score, down_payment):
    home_price = 500000
    required_income = home_price * 0.2
    required_down_payment = home_price * 0.1

    if (
        annual_income >= required_income
        and credit_score >= 650
        and down_payment >= required_down_payment
    ):
        eligibility = True
    else:
        eligibility = False

    return eligibility
