import pytest
from openai import OpenAI

from woodshed.integrations.providers.openai.chatbot_simple import (
    generate_ai_response,
    initialize_conversation,
)


@pytest.fixture
def openai_client():
    return OpenAI()


def test_generate_ai_response(openai_client):
    # Initialize the conversation
    messages = initialize_conversation()

    # Add a test user message
    messages.append({"role": "user", "content": "Hello, how are you?"})

    # Generate a response
    response = generate_ai_response(openai_client, messages)

    # Assert that the response is a non-empty string
    assert isinstance(response, str)
    assert len(response) > 0
