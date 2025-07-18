"""
Module for basic arithmetic operations: addition, subtraction, and multiplication.
"""

from .logger import setup_logger

# Set up the logger for this module
logger = setup_logger(__name__)


def add(a, b):
    """Return the sum of a and b."""
    result = a + b
    logger.info(f"Adding {a} and {b}: {result}")
    return result


def subtract(a, b):
    """Return the difference when b is subtracted from a."""
    result = a - b
    logger.info(f"Subtracting {b} from {a}: {result}")
    return result


def multiply(a, b):
    """Return the product of a and b."""
    result = a * b
    logger.info(f"Multiplying {a} and {b}: {result}")
    return result
