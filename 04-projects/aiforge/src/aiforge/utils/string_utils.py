# File: src/aiforge/utils/string_utils.py

"""Utility functions for string manipulation in the paz project.

This module provides various string manipulation functions that are used
throughout the paz project. These utilities aim to simplify common string
operations and provide consistent behavior across the project.

Functions:
    reverse_string(s: str) -> str: Returns the reversed version of the input string.
    # Add other function summaries as you implement them

Example:
    >>> from paz.utils.string_utils import reverse_string
    >>> reverse_string("hello")
    'olleh'

Note:
    All functions in this module are designed to be Unicode-aware and
    should work correctly with non-ASCII characters.
"""


def reverse_string(s):
    """Reverse the input string.

    Args:
        s (str): The input string to be reversed.

    Returns:
        str: The reversed string.

    Example:
        >>> reverse_string("hello")
        'olleh'
    """
    return s[::-1]
