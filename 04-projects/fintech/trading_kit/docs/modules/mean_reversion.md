# Mean Reversion Strategy Summary

## Overview

The Mean Reversion strategy is a trading approach based on the assumption that asset prices will revert to their historical mean over time. This strategy identifies overbought and oversold conditions in the market, allowing traders to capitalize on price corrections.

## Signal Logic

### Z-Score Calculation

The Z-score is a statistical measure that indicates how many standard deviations a data point is from the mean. In the context of stock prices, the Z-score helps identify whether a price is significantly above or below its historical average.

The Z-score is calculated using the formula:
\[ Z = \frac{(X - \mu)}{\sigma} \]

Where:

- \( X \) is the current price.
- \( \mu \) is the mean of the historical prices.
- \( \sigma \) is the standard deviation of the historical prices.

### Trading Signals

The Mean Reversion strategy generates three types of trading signals based on the Z-score:

1. **Buy Signal (1)**:
   - **Condition**: A buy signal is generated when the Z-score is less than the negative entry threshold (e.g., -1.0).
   - **Interpretation**: This indicates that the price is significantly below the mean, suggesting that the asset may be undervalued and is likely to increase in price.

2. **Sell Signal (-1)**:
   - **Condition**: A sell signal is generated when the Z-score is greater than the positive entry threshold (e.g., 1.0).
   - **Interpretation**: This indicates that the price is significantly above the mean, suggesting that the asset may be overvalued and is likely to decrease in price.

3. **Hold Signal (0)**:
   - **Condition**: A hold signal is generated when the Z-score is between the negative exit threshold and the positive exit threshold (e.g., between -0.0 and 0.0).
   - **Interpretation**: This indicates that the price is within a normal range, and no action should be taken.

### Real-World Example

Consider the following mock companies and their stock prices over a 10-day period:

| Day | Company A (Price) | Company B (Price) |
|-----|-------------------|-------------------|
| 1   | $50               | $200              |
| 2   | $52               | $202              |
| 3   | $51               | $198              |
| 4   | $49               | $205              |
| 5   | $48               | $210              |
| 6   | $47               | $207              |
| 7   | $48               | $208              |
| 8   | $51               | $202              |
| 9   | $55               | $195              |
| 10  | $54               | $190              |

### Calculating Z-Scores

For **Company A**:

- Mean (\( \mu \)): $50.4
- Standard Deviation (\( \sigma \)): $2.52
- Z-scores for the last two days:
  - Day 9: \( Z = \frac{(55 - 50.4)}{2.52} \approx 1.83 \) (Sell Signal)
  - Day 10: \( Z = \frac{(54 - 50.4)}{2.52} \approx 1.43 \) (Sell Signal)

For **Company B**:

- Mean (\( \mu \)): $202.5
- Standard Deviation (\( \sigma \)): $7.07
- Z-scores for the last two days:
  - Day 9: \( Z = \frac{(195 - 202.5)}{7.07} \approx -1.06 \) (Buy Signal)
  - Day 10: \( Z = \frac{(190 - 202.5)}{7.07} \approx -1.77 \) (Buy Signal)

### Generated Signals

- **Company A**: [0, 0, 0, 0, 0, 0, 0, 0, -1, -1]
- **Company B**: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0]

In this example:

- **Company A** generates sell signals on Days 9 and 10, indicating that the stock is overvalued and likely to decrease in price.

- **Company B** generates buy signals on Days 9 and 10, indicating that the stock is undervalued and likely to increase in price.

## Impact on Trading Mechanics

The Mean Reversion strategy can significantly impact trading mechanics in the following ways:

- **Entry and Exit Points**: By identifying overbought and oversold conditions, traders can make informed decisions about when to enter or exit positions, potentially increasing profitability.

- **Risk Management**: The strategy allows traders to set clear thresholds for buying and selling, which can help manage risk and reduce emotional decision-making.

- **Market Timing**: The strategy relies on statistical analysis, which can improve market timing and enhance the likelihood of successful trades.

## Conclusion

The Mean Reversion strategy is a powerful tool for traders looking to capitalize on price corrections. By understanding the signal logic and its implications for trading mechanics, traders can make more informed decisions and improve their overall trading performance.
