# PRISM Milestone 2: Collectors Enhancement

## Overview

This milestone focuses on enhancing the collector module of PRISM to support multiple data sources, specifically Perplexity and Yahoo Finance APIs. The goal is to create a modular, extensible, and maintainable structure for data collection that adheres to functional programming principles.

## Architectural Decisions

1. **Modular Structure**: We will convert the `collector.py` into a package with separate files for each data source.
2. **Functional Approach**: All collectors will be implemented as pure functions, avoiding classes and maintaining immutability where possible.
3. **Error Handling**: We will use centralized error handling through decorators to manage exceptions consistently across all collectors.
4. **Logging**: Each collector will have its own logger for detailed traceability.

## Directory Structure

```
prism/
├── collector/
│   ├── __init__.py
│   ├── collector.py
│   ├── perplexity_collector.py
│   └── yahoo_finance_collector.py
├── utils/
│   ├── __init__.py
│   ├── logger.py
│   └── error_handler.py
└── ... (other PRISM modules)
```

## Collector Package Design

### collector/__init__.py

This file will expose the main collection interface and individual collectors.

```python
"""
This module initializes the collector package and provides the main collection interface.
"""

from .collector import collect_all
from .perplexity_collector import collect_from_perplexity
from .yahoo_finance_collector import collect_from_yahoo_finance

__all__ = ['collect_all', 'collect_from_perplexity', 'collect_from_yahoo_finance']
```

### collector/collector.py

This file will contain the main collector functions that orchestrate data collection from various sources.

```python
"""
This module contains the main collector functions for PRISM.
"""

from typing import Dict, Any, List
from prism.utils.logger import setup_logger
from prism.utils.error_handler import handle_errors
from .perplexity_collector import collect_from_perplexity
from .yahoo_finance_collector import collect_from_yahoo_finance

logger = setup_logger('prism.collector', 'logs/collector.log')

@handle_errors
def collect_company_info(name: str, industry: str) -> Dict[str, Any]:
    """Collect comprehensive information about a company."""
    logger.info(f"Collecting comprehensive information for company: {name}")
    company_overview = collect_from_perplexity(f"{name} company overview")
    financial_data = collect_from_yahoo_finance(name)

    return {
        "name": name,
        "industry": industry,
        "overview": company_overview,
        "financial_data": financial_data
    }

# ... (other collection functions)

@handle_errors
def collect_all(company_name: str, industry: str) -> Dict[str, Any]:
    """Collect all available information for a company and its industry."""
    logger.info(f"Collecting all information for company: {company_name}")
    company_info = collect_company_info(company_name, industry)
    industry_info = collect_industry_info(industry)
    market_trends = collect_market_trends(industry)

    return {
        "company_info": company_info,
        "industry_info": industry_info,
        "market_trends": market_trends
    }
```

### collector/perplexity_collector.py

This file will contain the specific collector function for the Perplexity API.

```python
"""
This module contains the collector function for the Perplexity API.
"""

from typing import Dict, Any
import requests
from prism.utils.logger import setup_logger
from prism.utils.error_handler import handle_errors, DataCollectionError

logger = setup_logger('prism.collector.perplexity', 'logs/perplexity_collector.log')

@handle_errors
def collect_from_perplexity(query: str) -> Dict[str, Any]:
    """Collect data from Perplexity API."""
    logger.info(f"Collecting data from Perplexity for query: {query}")
    # TODO: Implement actual API call to Perplexity
    response = requests.get(f"https://api.perplexity.ai/query?q={query}")
    if response.status_code != 200:
        raise DataCollectionError(f"Failed to fetch data from Perplexity. Status code: {response.status_code}")
    return response.json()
```

### collector/yahoo_finance_collector.py

This file will contain the specific collector function for the Yahoo Finance API.

```python
"""
This module contains the collector function for the Yahoo Finance API.
"""

from typing import Dict, Any
import requests
from prism.utils.logger import setup_logger
from prism.utils.error_handler import handle_errors, DataCollectionError

logger = setup_logger('prism.collector.yahoo_finance', 'logs/yahoo_finance_collector.log')

@handle_errors
def collect_from_yahoo_finance(symbol: str) -> Dict[str, Any]:
    """Collect financial data from Yahoo Finance API."""
    logger.info(f"Collecting financial data for symbol: {symbol}")
    # TODO: Implement actual API call to Yahoo Finance
    response = requests.get(f"https://api.yahoofinance.com/v7/finance/quote?symbols={symbol}")
    if response.status_code != 200:
        raise DataCollectionError(f"Failed to fetch data from Yahoo Finance. Status code: {response.status_code}")
    return response.json()
```

## Gherkin Scenarios

```gherkin
Feature: Enhanced Data Collection

  Scenario: Collect company information from multiple sources
    Given a company name "TechCorp" and industry "Technology"
    When I request to collect all information
    Then I should receive a comprehensive data set
    And the data set should include company overview from Perplexity
    And the data set should include financial data from Yahoo Finance

  Scenario: Handle API errors gracefully
    Given the Perplexity API is unavailable
    When I request to collect company information
    Then I should receive an error message
    And the error should be logged
    And the collection process should continue for other data sources

  Scenario: Collect industry information
    Given an industry "Technology"
    When I request to collect industry information
    Then I should receive industry overview data from Perplexity

  Scenario: Collect market trends
    Given an industry "Technology"
    When I request to collect market trends
    Then I should receive a list of current market trends from Perplexity
```

## Implementation Guidelines

1. **API Integration**: 
   - Implement actual API calls in `perplexity_collector.py` and `yahoo_finance_collector.py`.
   - Use environment variables for API keys and endpoints.

2. **Error Handling**:
   - Use the `@handle_errors` decorator consistently across all collector functions.
   - Create specific error types for different collection failures.

3. **Logging**:
   - Use the logger in each collector for detailed logging of API calls and responses.
   - Ensure sensitive information is not logged.

4. **Testing**:
   - Write unit tests for each collector function.
   - Create integration tests for the `collect_all` function.
   - Use mocking to simulate API responses in tests.

5. **Documentation**:
   - Add detailed docstrings to all functions.
   - Update the main README with information about the new collector structure.

## Next Steps

1. Implement the actual API calls for Perplexity and Yahoo Finance.
2. Write comprehensive tests for the new collector functions.
3. Update the pipeline to use the new collector package.
4. Conduct a code review to ensure adherence to functional programming principles.
5. Plan for potential future collectors and how they would fit into this structure.