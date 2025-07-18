"""
Fabric Manufacturing Simulation Module

This module simulates the cost and production lead time for manufacturing fabric in the US.
It provides functions to calculate costs and lead times based on fabric type and quantity,
as well as a simulation runner to test various scenarios.

The module uses a functional programming approach and includes the following main components:
- Constant dictionaries for base costs and production times
- Functions for cost and lead time calculations
- A simulation runner function
- A main function to demonstrate usage

Constants:
    BASE_COST_PER_YARD (dict): Base cost per yard for different fabric types
    BASE_PRODUCTION_TIME (dict): Base production time (in days) for different fabric types

Functions:
    calculate_cost(fabric_type, quantity)
    calculate_lead_time(fabric_type, quantity)
    run_simulation(fabric_type, quantity)
    main()

Usage:
    Run this script directly to see a demonstration of the simulation:
    $ python fabric_manufacturing_simulation.py

Note:
    This simulation uses simplified models and random factors to approximate
    real-world variability. For accurate results, the constants and calculation
    methods should be calibrated with real manufacturing data.
"""

import random

# Constants
BASE_COST_PER_YARD = {
    'cotton': 5,
    'polyester': 3,
    'wool': 8,
    'silk': 15
}

BASE_PRODUCTION_TIME = {
    'cotton': 2,
    'polyester': 1.5,
    'wool': 3,
    'silk': 4
}

def calculate_cost(fabric_type: str, quantity: int) -> float:
    """
    Calculate the total cost of manufacturing a given quantity of fabric.

    This function considers the base material cost, market fluctuations,
    and labor costs to estimate the total manufacturing cost.

    Args:
        fabric_type (str): The type of fabric (e.g., 'cotton', 'polyester').
        quantity (int): The number of yards to be manufactured.

    Returns:
        float: The estimated total cost in USD.

    Raises:
        KeyError: If an unknown fabric type is provided.

    Note:
        - Base costs are defined in the BASE_COST_PER_YARD dictionary.
        - A random market fluctuation between -10% and +10% is applied.
        - Labor cost is calculated assuming $15/hour and 10 yards per hour.
    """
    base_cost = BASE_COST_PER_YARD[fabric_type]
    total_cost = base_cost * quantity
    
    # Add random fluctuation to simulate market variations
    fluctuation = random.uniform(0.9, 1.1)
    total_cost *= fluctuation
    
    # Add labor costs (assuming $15/hour and 10 yards per hour)
    labor_hours = quantity / 10
    labor_cost = labor_hours * 15
    
    return total_cost + labor_cost

def calculate_lead_time(fabric_type: str, quantity: int) -> float:
    """
    Calculate the production lead time for manufacturing a given quantity of fabric.

    This function estimates the total production time based on the fabric type,
    quantity, and potential delays.

    Args:
        fabric_type (str): The type of fabric (e.g., 'cotton', 'polyester').
        quantity (int): The number of yards to be manufactured.

    Returns:
        float: The estimated lead time in days.

    Raises:
        KeyError: If an unknown fabric type is provided.

    Note:
        - Base production times are defined in the BASE_PRODUCTION_TIME dictionary.
        - The function assumes increased efficiency with larger quantities.
        - A random delay between 0 and 2 days is added to simulate potential issues.
    """
    base_time = BASE_PRODUCTION_TIME[fabric_type]
    total_time = base_time * quantity / 100  # Assuming time is in days and efficiency increases with quantity
    
    # Add random delay to simulate potential issues
    delay = random.uniform(0, 2)
    total_time += delay
    
    return total_time

def run_simulation(fabric_type: str, quantity: int) -> None:
    """
    Run a simulation for manufacturing a specific type and quantity of fabric.

    This function calculates and prints the estimated cost and lead time
    for the given fabric manufacturing scenario.

    Args:
        fabric_type (str): The type of fabric to simulate.
        quantity (int): The number of yards to simulate manufacturing.

    Prints:
        - Fabric Type
        - Quantity
        - Estimated Cost
        - Estimated Lead Time

    Note:
        This function calls calculate_cost() and calculate_lead_time()
        and formats the output for easy reading.
    """
    cost = calculate_cost(fabric_type, quantity)
    lead_time = calculate_lead_time(fabric_type, quantity)
    
    print(f"Fabric Type: {fabric_type}")
    print(f"Quantity: {quantity} yards")
    print(f"Estimated Cost: ${cost:.2f}")
    print(f"Estimated Lead Time: {lead_time:.1f} days")
    print("---")

def main() -> None:
    """
    Main function to demonstrate the fabric manufacturing simulation.

    This function runs simulations for various combinations of fabric types
    and quantities, showcasing the usage of the module's functions.

    Fabric types tested: cotton, polyester, wool, silk
    Quantities tested: 100, 500, 1000 yards

    Note:
        This function is called when the script is run directly.
    """
    fabric_types = ['cotton', 'polyester', 'wool', 'silk']
    quantities = [100, 500, 1000]

    for fabric in fabric_types:
        for quantity in quantities:
            run_simulation(fabric, quantity)

if __name__ == "__main__":
    main()
