from typing import List, Union

import numpy as np


class DCFModel:
    """
    A simple Discounted Cash Flow (DCF) model for company valuation.
    """

    def __init__(
        self,
        cash_flows: List[float],
        discount_rate: float,
        terminal_growth_rate: float = 0.02,
    ):
        """
        Initialize the DCF model.

        Args:
            cash_flows (List[float]): Projected future cash flows.
            discount_rate (float): The discount rate to apply to future cash flows.
            terminal_growth_rate (float): The growth rate for the terminal value calculation.

        Raises:
            ValueError: If inputs are invalid.
        """
        if not cash_flows:
            raise ValueError("Cash flows list cannot be empty.")
        if discount_rate <= 0 or discount_rate >= 1:
            raise ValueError("Discount rate must be between 0 and 1.")
        if terminal_growth_rate < 0 or terminal_growth_rate >= discount_rate:
            raise ValueError(
                "Terminal growth rate must be non-negative and less than the discount rate."
            )

        self.cash_flows = cash_flows
        self.discount_rate = discount_rate
        self.terminal_growth_rate = terminal_growth_rate

    def calculate_npv(self) -> float:
        """
        Calculate the Net Present Value (NPV) of the cash flows.

        Returns:
            float: The calculated NPV.
        """
        npv = 0
        for t, cf in enumerate(self.cash_flows, start=1):
            npv += cf / (1 + self.discount_rate) ** t
        return npv

    def calculate_terminal_value(self) -> float:
        """
        Calculate the terminal value using the Gordon Growth Model.

        Returns:
            float: The calculated terminal value.
        """
        final_cash_flow = self.cash_flows[-1]
        terminal_value = (
            final_cash_flow
            * (1 + self.terminal_growth_rate)
            / (self.discount_rate - self.terminal_growth_rate)
        )
        return terminal_value / (1 + self.discount_rate) ** len(self.cash_flows)

    def calculate_firm_value(self) -> float:
        """
        Calculate the total firm value (NPV of cash flows + terminal value).

        Returns:
            float: The calculated firm value.
        """
        return self.calculate_npv() + self.calculate_terminal_value()

    def calculate_present_value_factor(self, year: int) -> float:
        """
        Calculate the present value factor for a given year.

        Args:
            year (int): The year for which to calculate the factor.

        Returns:
            float: The calculated present value factor.
        """
        return 1 / (1 + self.discount_rate) ** year

    def sensitivity_analysis(
        self, discount_rates: List[float], growth_rates: List[float]
    ) -> np.ndarray:
        """
        Perform sensitivity analysis on the firm value.

        Args:
            discount_rates (List[float]): List of discount rates to test.
            growth_rates (List[float]): List of growth rates to test.

        Returns:
            np.ndarray: 2D array of firm values for each combination of discount rate and growth rate.
        """
        results = np.zeros((len(discount_rates), len(growth_rates)))

        for i, dr in enumerate(discount_rates):
            for j, gr in enumerate(growth_rates):
                temp_model = DCFModel(self.cash_flows, dr, gr)
                results[i, j] = temp_model.calculate_firm_value()

        return results
