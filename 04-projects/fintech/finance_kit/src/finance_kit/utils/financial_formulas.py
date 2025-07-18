from typing import List

import numpy as np
import numpy_financial as npf


def calculate_npv(cash_flows: List[float], discount_rate: float) -> float:
    """
    Calculate the Net Present Value (NPV) of a series of cash flows.

    Args:
        cash_flows (List[float]): List of cash flows. The first cash flow is considered to be at t=0.
        discount_rate (float): The discount rate to apply to the cash flows.

    Returns:
        float: The calculated NPV.

    Raises:
        ValueError: If the inputs are invalid.
    """
    if not cash_flows:
        raise ValueError("Cash flows list cannot be empty.")
    if discount_rate <= -1:
        raise ValueError("Discount rate must be greater than -1.")

    npv = cash_flows[0]  # The first cash flow is not discounted
    for t, cf in enumerate(cash_flows[1:], start=1):
        npv += cf / (1 + discount_rate) ** t
    return npv


def calculate_irr(cash_flows: List[float]) -> float:
    """
    Calculate the Internal Rate of Return (IRR) of a series of cash flows.

    Args:
        cash_flows (List[float]): List of cash flows. The first cash flow is considered to be at t=0.

    Returns:
        float: The calculated IRR.

    Raises:
        ValueError: If the inputs are invalid or IRR cannot be calculated.
    """
    if len(cash_flows) < 2:
        raise ValueError("At least two cash flows are required to calculate IRR.")

    # Check for sign change
    if all(cf >= 0 for cf in cash_flows) or all(cf <= 0 for cf in cash_flows):
        raise ValueError(
            "Unable to calculate IRR. Check if there's a sign change in cash flows."
        )

    try:
        return npf.irr(cash_flows)  # Use npf.irr instead of np.irr
    except ValueError:
        raise ValueError(
            "Unable to calculate IRR. Check if there's a sign change in cash flows."
        )


# Additional financial formula functions can be added here
