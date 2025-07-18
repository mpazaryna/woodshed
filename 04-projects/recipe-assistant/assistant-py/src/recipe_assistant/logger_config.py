"""
This module provides functionality for setting up and configuring loggers.

It contains a utility function to create and configure logging instances
with customizable output streams and formatting.
"""

import logging


def setup_logger(name: str, level: int = logging.INFO, log_file: str = None) -> logging.Logger:
    """
    Set up and configure a logger for the given name.

    Args:
        name (str): The name of the logger.
        level (int): The logging level. Defaults to logging.INFO.
        log_file (str): Optional. If provided, adds a FileHandler to log to this file.

    Returns:
        logging.Logger: A configured logger instance.
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not logger.handlers:
        formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

        # Add StreamHandler
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

        # Add FileHandler if log_file is provided
        if log_file:
            file_handler = logging.FileHandler(log_file)
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)

    return logger
