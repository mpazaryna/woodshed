# src/risk_kit/calculator.py

"""
This module implements the Factory pattern for creating different types of financial calculators.

The Factory pattern is used here to provide a centralized way of creating and accessing
different calculator types without the need to import specific calculator modules directly.
This approach offers several benefits:

1. Encapsulation: It hides the complexity of calculator creation from the client code.
2. Flexibility: New calculator types can be easily added without changing existing client code.
3. Centralized configuration: All calculator types are defined and managed in one place.
4. Improved maintainability: Changes to calculator implementations only need to be updated here.

By using this pattern, we can easily extend our system with new calculator types in the future
while keeping the interface for obtaining calculators consistent and simple to use.
"""

from risk_kit.calculators.finance_assessor import assess_risk, classify_risk
from risk_kit.calculators.finance_mortgage import assess_mortgage_eligibility


class Calculator:
    @staticmethod
    def get(calculator_type: str) -> dict:
        """
        Factory method to get a specific type of financial calculator.

        This method implements the Factory pattern to create and return different types
        of calculators based on the input parameter. It centralizes the creation logic
        and provides a single point of access for all calculator types.

        Args:
            calculator_type (str): The type of calculator to retrieve.
                                   Currently supports "risk" and "mortgage".

        Returns:
            dict: A dictionary containing the relevant calculator functions for the specified type.
                  For "risk", it returns {"assess_risk": func, "classify_risk": func}.
                  For "mortgage", it returns {"assess_mortgage_eligibility": func}.

        Raises:
            ValueError: If an unknown calculator type is requested.

        Examples:
            >>> risk_calc = Calculator.get("risk")
            >>> risk_calc["assess_risk"](annual_income, credit_score, debt_to_income)
            >>> mortgage_calc = Calculator.get("mortgage")
            >>> mortgage_calc["assess_mortgage_eligibility"](annual_income, credit_score, down_payment)

        Note:
            This method can be easily extended to support additional calculator types
            by adding new elif conditions and corresponding function mappings.
        """
        if calculator_type == "risk":
            return {
                "assess_risk": assess_risk,
                "classify_risk": classify_risk,
            }
        elif calculator_type == "mortgage":
            return {
                "assess_mortgage_eligibility": assess_mortgage_eligibility,
            }
        else:
            raise ValueError(f"Unknown calculator type: {calculator_type}")
