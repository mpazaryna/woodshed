"""
This module provides error handling functionality for PRISM.
"""

from functools import wraps
from typing import Any, Callable

from requests.exceptions import RequestException, Timeout

from .logging import prism_logger


class PRISMError(Exception):
    """Base exception class for PRISM-specific errors."""

    pass


class DataCollectionError(PRISMError):
    """Exception raised for errors in the data collection process."""

    pass


class AnalysisError(PRISMError):
    """Exception raised for errors in the analysis process."""

    pass


class ReportingError(PRISMError):
    """Exception raised for errors in the reporting process."""

    pass


def handle_errors(func: Callable) -> Callable:
    """
    Decorate a function to handle errors.

    Args:
    func (Callable): The function to decorate.

    Returns:
    Callable: Decorated function with error handling.
    """

    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        try:
            return func(*args, **kwargs)
        except PRISMError as e:
            prism_logger.error(f"PRISM-specific error in {func.__name__}: {str(e)}")
            raise
        except Exception as e:
            prism_logger.error(f"Unexpected error in {func.__name__}: {str(e)}")
            raise PRISMError(f"An unexpected error occurred in {func.__name__}") from e

    return wrapper


def safe_execute(func: Callable, *args, **kwargs) -> Any:
    """
    Safely execute a function and handle any errors.

    Args:
    func (Callable): The function to execute.
    *args: Positional arguments to pass to the function.
    **kwargs: Keyword arguments to pass to the function.

    Returns:
    Any: The result of the function if successful, None otherwise.
    """
    try:
        return func(*args, **kwargs)
    except Exception as e:
        prism_logger.error(f"Error executing {func.__name__}: {str(e)}")
        return None


def handle_request_error(exception: RequestException, api_name: str, response, logger):
    """
    Handle request exceptions for API calls.

    Args:
        exception (RequestException): The caught exception.
        api_name (str): Name of the API being called.
        response: The response object from the request.
        logger: The logger object to use for logging.

    Raises:
        TimeoutError: If a 524 error is received.
        RequestException: For all other request exceptions.
    """
    logger.error(f"Error making request to {api_name}: {str(exception)}")
    if response.status_code == 524:
        logger.error("Received a 524 error (Origin Time-out)")
        raise TimeoutError(f"Received a 524 error (Origin Time-out) from {api_name}")
    logger.error(f"Response content: {response.text}")
    raise exception


def handle_timeout_error(exception: Timeout, api_name: str, timeout: int, logger):
    """
    Handle timeout errors for API calls.

    Args:
        exception (Timeout): The caught timeout exception.
        api_name (str): Name of the API being called.
        timeout (int): The timeout value that was set for the request.
        logger: The logger object to use for logging.

    Raises:
        TimeoutError: Always raised with a descriptive message.
    """
    logger.error(f"Request to {api_name} timed out after {timeout} seconds")
    raise TimeoutError(
        f"Request to {api_name} timed out after {timeout} seconds"
    ) from exception
