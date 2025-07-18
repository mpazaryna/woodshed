import logging

from risk_kit.config import config


def test_logging_writes_to_logs_directory():
    config.ensure_directories_exist()  # This sets up logging
    config.setup_logging(
        file_level=logging.DEBUG
    )  # Explicitly set file logging to DEBUG

    logger = logging.getLogger(__name__)

    logger.debug("This is a debug message from pytest")
    logger.info("This is an info message from pytest")
    logger.warning("This is a warning message from pytest")
    logger.error("This is an error message from pytest")

    log_file = config.log_file
    assert log_file.exists(), f"Log file does not exist at {log_file}"

    log_content = log_file.read_text()
    print(f"Log file content:\n{log_content}")

    assert "debug message from pytest" in log_content
    assert "info message from pytest" in log_content
    assert "warning message from pytest" in log_content
    assert "error message from pytest" in log_content

    print(f"Test passed. Log messages have been written to {log_file}")
