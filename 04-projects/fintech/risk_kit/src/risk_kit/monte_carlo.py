"""
monte_carlo.simulation

This module provides a Monte Carlo simulation implementation for estimating
the value of a mathematical function using random sampling.

Functions:
- monte_carlo_integration: Estimate the integral of a function over a given range.
"""

import random


def monte_carlo_integration(func, a, b, num_samples):
    """
    Estimate the integral of a function using Monte Carlo simulation.

    Parameters:
    - func: The function to integrate. It should take a single argument.
    - a: The lower bound of the integration range.
    - b: The upper bound of the integration range.
    - num_samples: The number of random samples to use for the estimation.

    Returns:
    - float: The estimated value of the integral.
    """
    total = 0.0
    for _ in range(num_samples):
        x = random.uniform(a, b)
        total += func(x)
    return (b - a) * total / num_samples


def portfolio_return(weights, returns):
    """
    Calculate the expected return of a portfolio consisting of various assets.

    This function evaluates the expected return of a portfolio that includes
    assets from different companies. For example, consider a portfolio that
    includes stocks from Acme Corp, VanDeLay Industries, and Flubba Technologies.
    Each company has a different expected return based on market conditions and
    historical performance.

    Parameters:
    - weights: A list of weights for each asset in the portfolio, representing
      the proportion of the total investment allocated to each asset. For instance,
      if the portfolio consists of 40% in Acme Corp, 30% in VanDeLay Industries,
      and 30% in Flubba Technologies, the weights would be [0.4, 0.3, 0.3].
    - returns: A list of expected returns for each asset, expressed as decimal
      values. For example, if Acme Corp has an expected return of 5%, VanDeLay
      Industries has 10%, and Flubba Technologies has 15%, the returns would be
      [0.05, 0.10, 0.15].

    Returns:
    - float: The expected return of the portfolio, calculated as the weighted
      sum of the expected returns of the individual assets. This value helps
      investors understand the potential profitability of their investment
      strategy involving these companies.
    """
    return sum(w * r for w, r in zip(weights, returns))
