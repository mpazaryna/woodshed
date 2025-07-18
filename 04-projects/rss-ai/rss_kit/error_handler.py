"""
Error Handler Module

This module provides custom exceptions and error handling functionality
for the RSS AI project.

Classes:
    RSSAIError: Base exception class for RSS AI errors
    FeedFetchError: Exception for errors when fetching RSS feeds
    ParseError: Exception for errors when parsing data (YAML, RSS, etc.)
    FilterError: Exception for errors during article filtering

Functions:
    handle_error: Generic error handler function
"""

import logging
from typing import Optional, Type

# Setup logger
logger = logging.getLogger(__name__)


class RSSAIError(Exception):
    """Base exception class for RSS AI errors"""


class FeedFetchError(RSSAIError):
    """Exception raised when there's an error fetching an RSS feed"""


class ParseError(RSSAIError):
    """Exception raised when there's an error parsing data (YAML, RSS, etc.)"""


class FilterError(RSSAIError):
    """Exception raised when there's an error during article filtering"""


def handle_error(
    error: Exception,
    error_type: Type[Exception] = RSSAIError,
    message: Optional[str] = None,
):
    """
    Generic error handler function

    Args:
        error (Exception): The caught exception
        error_type (Type[Exception]): The type of exception to raise (default: RSSAIError)
        message (Optional[str]): Additional error message

    Raises:
        error_type: Raises the specified error type with a formatted error message
    """
    error_message = f"{message + ': ' if message else ''}{str(error)}"
    logger.error(error_message)
    raise error_type(error_message)
