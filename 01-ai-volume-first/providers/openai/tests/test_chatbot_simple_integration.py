import os

import pytest
from openai import OpenAI

from woodshed.integrations.providers.openai.chatbot_simple import (
    generate_ai_response,
    initialize_conversation,
)


@pytest.fixture
def openai_client():
    return OpenAI()


def test_generate_ai_response_integration(openai_client):
    # Initialize the conversation
    messages = initialize_conversation()

    # Add a user message
    user_message = "Hello, how are you?"
    messages.append({"role": "user", "content": user_message})

    # Generate AI response
    response = generate_ai_response(openai_client, messages)

    # Assert that we received a non-empty response
    assert response.strip() != ""
    assert (
        len(response) > 10
    )  # Assuming the response should be at least 10 characters long

    # Check if the response seems relevant to the user's message
    assert any(
        word in response.lower() for word in ["hello", "hi", "greetings", "doing"]
    )


def test_multiple_turns_conversation(openai_client):
    messages = initialize_conversation()

    # First turn
    messages.append({"role": "user", "content": "What's the capital of France?"})
    response1 = generate_ai_response(openai_client, messages)
    messages.append({"role": "assistant", "content": response1})

    assert "Paris" in response1

    # Second turn
    messages.append({"role": "user", "content": "What's its population?"})
    response2 = generate_ai_response(openai_client, messages)

    assert any(
        word in response2.lower() for word in ["million", "population", "people"]
    )
