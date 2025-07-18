# Risk Kit Module

This module provides tools for risk assessment and mortgage eligibility calculations.

## Project Structure

## Running the CLI

The Command Line Interface (CLI) for Risk Kit is now located in the main module directory for consistency and easier testing. You can run it directly as a module using the following command:

python -m risk_kit.cli --calculator <calculator_type>

Replace `<calculator_type>` with either `mortgage` or `risk` depending on which calculator you want to use.

Examples:

1. To run the mortgage calculator:
   ```
   python -m risk_kit.cli --calculator mortgage
   ```

2. To run the risk calculator:
   ```
   python -m risk_kit.cli --calculator risk
   ```

## Features

- Risk assessment calculations
- Mortgage eligibility assessment
- Logging functionality
- Modular design with calculator factory pattern

For more detailed information on each module and its functionality, please refer to the individual file docstrings and comments.
