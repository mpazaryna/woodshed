"""
exceptions.py

This module defines custom exceptions for the Trading Kit project.

Rationale:
-----------
In a large and complex project, error handling can become scattered and inconsistent if not managed properly.
By defining custom exceptions in a centralized module, we can achieve the following benefits:

1. **Consistency**: Ensures that similar types of errors are handled in a consistent manner across the entire project.
2. **Readability**: Makes the code more readable and maintainable by providing clear and descriptive error messages.
3. **Modularity**: Encapsulates error handling logic in a single place, making it easier to manage and update.
4. **Granularity**: Allows for more granular error handling, enabling the differentiation between various types of errors.
5. **Debugging**: Simplifies debugging by providing specific exception types that can be caught and logged.

Custom Exceptions:
-------------------
- TradingKitError: Base class for all exceptions raised by the trading kit.
- InvalidDataError: Raised when the input data is invalid.
- InvalidThresholdError: Raised when the threshold values are invalid.

Usage:
-------
Import the necessary exceptions from this module and use them in your functions to handle errors appropriately.

Example:
--------
from trading_kit.exceptions import InvalidDataError, InvalidThresholdError

def some_function(data):
    if not isinstance(data, list):
        raise InvalidDataError("Input data must be a list.")
    # ... rest of the function ...

"""


class TradingKitError(Exception):
    """Base class for all exceptions raised by the trading kit."""

    pass


class InvalidDataError(TradingKitError):
    """Raised when the input data is invalid."""

    pass


class InvalidThresholdError(TradingKitError):
    """Raised when the threshold values are invalid."""

    pass


class InvalidWindowSizeError(TradingKitError):
    """Raised when the window size is invalid."""

    pass


class InvalidEntryThresholdError(TradingKitError):
    """Raised when the entry threshold is invalid."""

    pass
