import os

import pytest
from cli_chat_csv import main
from warning_logger import log_warnings


@log_warnings()
def test_total_transactions():
    csv_file_path = "ChatGPT.csv"
    question = "what is the total of all transactions"

    result = main(csv_file_path, question)

    # Check if result is a dictionary
    assert isinstance(result, dict), "Result should be a dictionary"

    # Check if the result contains an error message if the file is not found
    if "error" in result:
        assert (
            result["error"] == f"The file {csv_file_path} was not found."
        ), f"Expected error message for missing file, but got '{result['error']}'"
    else:
        # Check if the output contains the expected answer
        expected_answer = "The total of all transactions is -3875.5199999999995."
        assert (
            result["output"] == expected_answer
        ), f"Expected '{expected_answer}', but got '{result['output']}'"


@pytest.fixture
def cleanup_test_log():
    yield
    # Clean up only the specific test log file
    test_log_file = "logs/test_warnings.log"
    if os.path.exists(test_log_file):
        os.remove(test_log_file)


def test_log_file_creation(cleanup_test_log):
    test_log_file = "logs/test_warnings.log"

    @log_warnings(log_file=test_log_file)
    def function_that_warns():
        import warnings

        warnings.warn("This is a test warning")

    function_that_warns()

    # Check if the log file exists in the logs folder
    assert os.path.exists(
        test_log_file
    ), "Log file should be created in the logs folder"

    # Check the content of the log file
    with open(test_log_file, "r") as log_file:
        log_content = log_file.read()
        assert (
            "This is a test warning" in log_content
        ), "Log file should contain the warning message"
