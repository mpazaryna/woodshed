"""
Utility functions and configurations for the DALL-E application.
"""

import logging


def setup_logging(log_file=None):
    """
    Set up logging configuration.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        filename=log_file,
        filemode="a" if log_file else "w",
    )
    if not log_file:
        # If no log file is specified, also log to console
        console = logging.StreamHandler()
        console.setLevel(logging.INFO)
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        console.setFormatter(formatter)
        logging.getLogger("").addHandler(console)
