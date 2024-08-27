import logging
import warnings
from functools import wraps


def log_warnings(logger_name="warning_logger", log_file="logs/warnings.log"):
    """
    A decorator that logs warnings that occur during the execution of a function.

    :param logger_name: Name of the logger (default: 'warning_logger')
    :param log_file: File to log warnings to (default: 'warnings.log')
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Set up logging
            logger = logging.getLogger(logger_name)
            logger.setLevel(logging.WARNING)

            # Create file handler and set level to warning
            file_handler = logging.FileHandler(log_file)
            file_handler.setLevel(logging.WARNING)

            # Create formatter
            formatter = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            )
            file_handler.setFormatter(formatter)

            # Add file handler to logger
            logger.addHandler(file_handler)

            # Custom warning handler
            def warning_handler(
                message, category, filename, lineno, file=None, line=None
            ):
                logger.warning(
                    f"{category.__name__}: {message} (File: {filename}, Line: {lineno})"
                )

            # Execute the function and capture warnings
            with warnings.catch_warnings(record=True) as w:
                warnings.simplefilter("always")
                result = func(*args, **kwargs)

                # Log any warnings that were caught
                for warning in w:
                    warning_handler(
                        warning.message,
                        warning.category,
                        warning.filename,
                        warning.lineno,
                    )

            # Remove the file handler to avoid duplicate handlers on subsequent calls
            logger.removeHandler(file_handler)

            return result

        return wrapper

    return decorator
