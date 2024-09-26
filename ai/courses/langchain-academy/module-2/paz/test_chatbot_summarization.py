"""
Run the tests using the following command:
pytest -s --log-cli-level=INFO test_chatbot_summarization.py

--log-cli-level=INFO: This option tells pytest to show log messages at 
the INFO level and above in the console.
"""

import logging

import pytest
from chatbot_summarization import State, call_model, summarize_conversation

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_call_model():
    state = State(messages=["Hello", "How are you?"], summary="")
    response = call_model(state)
    logger.info("Response from call_model: %s", response)  # Log the response
    assert "messages" in response
    logger.info("Messages in response: %s", response["messages"])  # Log the messages


def test_summarize_conversation():
    state = State(messages=["Hello", "How are you?"], summary="Initial greeting.")
    response = summarize_conversation(state)
    logger.info(
        "Response from summarize_conversation: %s", response
    )  # Log the response
    assert "summary" in response
    assert response["summary"] != ""
    logger.info("Summary in response: %s", response["summary"])  # Log the summary
