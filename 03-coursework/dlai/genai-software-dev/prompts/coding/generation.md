# Comprehensive Code Generation

## Context

Use this template when you need complete, production-ready code with proper error handling, tests, and documentation.

## Prompt Structure

I need a Python [component/function/class] that [main purpose].

Requirements:

1. Functional Requirements
   - Input: [describe expected inputs]
   - Output: [describe expected outputs]
   - Core functionality: [describe what it should do]

2. Technical Requirements
   - Python version: [specify version]
   - Dependencies: [list any required libraries]
   - Performance constraints: [if any]

3. Include:
   - Type hints
   - Input validation
   - Error handling
   - Docstrings
   - Example usage
   - Unit tests

4. Consider:
   - Edge cases
   - Performance implications
   - Memory usage
   - Thread safety (if applicable)

Please structure the response with:

1. Code implementation
2. Usage examples
3. Test cases
4. Performance notes
5. Future improvement suggestions

## Example Usage

I need a Python function that processes a large CSV file containing time series data.

Requirements:

1. Functional Requirements
   - Input: CSV file path, column names for timestamp and value
   - Output: Dictionary with basic statistics and outlier information
   - Core functionality: Calculate rolling averages and identify outliers

2. Technical Requirements
   - Python 3.10+
   - Dependencies: pandas, numpy
   - Should handle files up to 1GB efficiently

3. Include all standard requirements...

## Tags

coding implementation python best-practices
