"""
This module provides logging functionality for PRISM.
"""

import logging
import os
from functools import wraps
from pathlib import Path


def setup_logger(name: str, log_file: str, level: int = logging.INFO) -> logging.Logger:
    """
    Set up a logger with a specified name and level, writing to both console and file.

    Args:
    name (str): Name of the logger.
    log_file (str): Path to the log file.
    level (int): Logging level (default: logging.INFO).

    Returns:
    logging.Logger: Configured logger instance.
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not logger.handlers:
        # Create logs directory if it doesn't exist
        log_dir = os.path.dirname(log_file)
        Path(log_dir).mkdir(parents=True, exist_ok=True)

        # File handler
        file_handler = logging.FileHandler(log_file)
        file_formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)

        # Console handler
        console_handler = logging.StreamHandler()
        console_formatter = logging.Formatter("%(name)s - %(levelname)s - %(message)s")
        console_handler.setFormatter(console_formatter)
        logger.addHandler(console_handler)

    return logger


def log_function_call(logger: logging.Logger):
    """
    Decorate a function to log function calls.

    Args:
    logger (logging.Logger): Logger instance to use for logging.

    Returns:
    Callable: Decorated function.
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger.info(f"Calling function: {func.__name__}")
            result = func(*args, **kwargs)
            logger.info(f"Function {func.__name__} completed")
            return result

        return wrapper

    return decorator


# Create a default logger for the PRISM application
prism_logger = setup_logger("prism", "logs/prism.log")

# Create a specific logger for the pipeline
pipeline_logger = setup_logger("prism.pipeline", "logs/pipeline.log")
