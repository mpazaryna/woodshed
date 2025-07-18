# Finance Kit - Ratios Module

## Overview

The `ratios.py` module is a core component of the finance_kit package, designed to provide essential financial ratio calculations. This module offers a set of functions to compute various financial metrics, enabling users to analyze company performance and financial health efficiently.

## Functions

### calculate_roe(net_income: float, shareholder_equity: float) -> float

Calculates the Return on Equity (ROE) ratio.

#### Parameters:
- `net_income` (float): The company's net income.
- `shareholder_equity` (float): The total shareholder equity.

#### Returns:
- float: The calculated ROE as a decimal.

#### Raises:
- ValueError: If shareholder_equity is zero or negative.
- TypeError: If inputs are not numeric.

#### Usage:
```python
roe = calculate_roe(1000000, 5000000)
print(f"Return on Equity: {roe:.2%}")
```

## Rationale and Real-World Examples

### Return on Equity (ROE)

The Return on Equity (ROE) ratio is a crucial metric in financial analysis, measuring a company's profitability in relation to shareholders' equity. It essentially tells us how efficiently a company is using its equity to generate profits.

#### Why it's important:
1. **Profitability Indicator**: ROE provides insight into how well a company's management is using shareholders' investments to drive growth and generate returns.
2. **Comparison Tool**: It allows investors to compare the performance of different companies within the same industry.
3. **Trend Analysis**: By tracking ROE over time, analysts can identify trends in a company's financial performance.

#### Real-World Example:
Let's consider two hypothetical tech companies:

1. TechGiant Corp:
   - Net Income: $10 billion
   - Shareholder Equity: $50 billion
   - ROE = 10 / 50 = 0.20 or 20%

2. StartUpTech Inc:
   - Net Income: $100 million
   - Shareholder Equity: $1 billion
   - ROE = 0.1 / 1 = 0.10 or 10%

```python
tech_giant_roe = calculate_roe(10e9, 50e9)
startup_tech_roe = calculate_roe(100e6, 1e9)

print(f"TechGiant Corp ROE: {tech_giant_roe:.2%}")
print(f"StartUpTech Inc ROE: {startup_tech_roe:.2%}")
```

In this example, TechGiant Corp has a higher ROE, indicating that it's generating more profit per dollar of shareholder equity compared to StartUpTech Inc. However, it's important to note that ROE should be considered alongside other financial metrics and industry standards for a comprehensive analysis.

## Future Enhancements

The `ratios.py` module is designed to be expandable. Additional financial ratio calculations can be easily added to provide a more comprehensive suite of financial analysis tools. Some potential additions could include:

- Profit Margin
- Debt-to-Equity Ratio
- Current Ratio
- Price-to-Earnings Ratio

By continuing to expand this module, the finance_kit package can become an increasingly powerful tool for financial analysis and decision-making.