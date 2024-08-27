import pytest
from cli_chat_csv import main
from warning_logger import log_warnings


@log_warnings()
def test_total_transactions():
    csv_file_path = "ChatGPT.csv"
    question = "what is the total of all transactions"

    result = main(csv_file_path, question)

    # Check if result is a dictionary and has an 'output' key
    assert isinstance(result, dict), "Result should be a dictionary"
    assert "output" in result, "Result should contain 'output' key"

    # Check if the output contains the expected answer
    expected_answer = "The total of all transactions is -3875.5199999999995."
    assert (
        result["output"] == expected_answer
    ), f"Expected '{expected_answer}', but got '{result['output']}'"
