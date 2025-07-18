# Financial Risk Model with Synthetic Data

## Overview

Create a basic financial risk assessment model using synthetic data. This model will predict the likelihood of loan default based on key financial indicators.

## Data Generation

Generate a synthetic dataset with the following features:

1. Annual Income: Normal distribution, mean $50,000, standard deviation $15,000
2. Credit Score: Normal distribution, mean 700, standard deviation 50
3. Debt-to-Income Ratio: Normal distribution, mean 0.3, standard deviation 0.1

## Risk Classification

Define a binary risk classification (high risk / low risk) based on these criteria:

- High risk if:
  - Annual income < $40,000, or
  - Credit score < 650, or
  - Debt-to-income ratio > 0.4

## Model

Use a logistic regression model to predict the risk of loan default.

## Process

1. Generate synthetic data (1000 samples)
2. Create the target variable based on the risk classification rules
3. Split data into training (80%) and testing (20%) sets
4. Train the logistic regression model on the training data
5. Evaluate the model using the testing data
6. Create a function to query the model with new data points

## Model Usage

The model should accept three inputs (annual income, credit score, debt-to-income ratio) and return:

1. A binary risk assessment (high risk / low risk)
2. The probability of being high risk

## Potential Expansions

- Incorporate more features (e.g., employment history, loan amount)
- Experiment with different machine learning algorithms
- Add data visualization for risk factors
- Implement cross-validation for more robust evaluation
- Create a simple API for model queries
