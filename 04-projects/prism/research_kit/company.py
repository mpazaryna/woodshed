"""
This module handles company management and profiling functionality for PRISM.
"""

import random  # For generating dummy data
from typing import Dict, List

CompanyData = Dict[str, str]

# In-memory storage for companies (replace with database in future)
companies: List[CompanyData] = []


def add_company(name: str, industry: str) -> CompanyData:
    """
    Add a new company to the research list and gather its information.

    Args:
    name (str): The name of the company.
    industry (str): The industry of the company.

    Returns:
    CompanyData: A dictionary containing the added company's information.

    Raises:
    ValueError: If a company with the given name already exists.
    """
    for company in companies:
        if company["name"] == name:
            raise ValueError(f"Company '{name}' already exists")

    new_company = gather_company_info(name, industry)
    companies.append(new_company)
    return new_company


def gather_company_info(name: str, industry: str) -> CompanyData:
    """
    Gather information about a company to create its profile.

    In a real-world scenario, this function would interact with various data sources
    to collect comprehensive information about the company. For this example, we're
    generating dummy data.

    Args:
    name (str): The name of the company.
    industry (str): The industry of the company.

    Returns:
    CompanyData: A dictionary containing the gathered company information.
    """
    # In a real application, you'd replace this with actual data collection logic
    revenue = random.randint(100000, 10000000)
    employees = random.randint(10, 10000)
    founded = random.randint(1900, 2023)

    return {
        "name": name,
        "industry": industry,
        "revenue": f"${revenue:,}",
        "employees": str(employees),
        "founded": str(founded),
        "description": f"{name} is a leading company in the {industry} industry.",
    }
