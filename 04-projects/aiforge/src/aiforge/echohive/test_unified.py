import logging
import os

import pytest

from aiforge.echohive.unified import UnifiedApis

logger = logging.getLogger(__name__)


@pytest.fixture
def api_key():
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        pytest.skip("OPENAI_API_KEY not set in environment variables")
    return key


@pytest.fixture
def openai_api(api_key):
    return UnifiedApis(
        provider="openai", api_key=api_key, model="gpt-3.5-turbo", stream=False
    )


def test_openai_chat(openai_api):
    response = openai_api.chat("Hello, how are you?")
    assert isinstance(response, str)
    assert len(response) > 0


@pytest.mark.asyncio
async def test_openai_chat_async(api_key):
    openai_api = UnifiedApis(
        provider="openai",
        api_key=api_key,
        model="gpt-3.5-turbo",
        use_async=True,
        stream=False,
    )
    response = await openai_api.chat_async("What's the capital of France?")
    assert isinstance(response, str)
    assert "Paris" in response


@pytest.mark.parametrize("json_mode", [True, False])
def test_openai_json_mode(api_key, json_mode):
    openai_api = UnifiedApis(
        provider="openai", api_key=api_key, model="gpt-3.5-turbo", json_mode=json_mode
    )
    response = openai_api.chat("What's the capital of Spain?")

    # Check if the response is in the expected format
    if json_mode:
        assert isinstance(response, dict), f"Expected dict, got {type(response)}"

        # Check if either 'response' or 'answer' key is present in the response
        assert any(
            key in response for key in ["response", "answer", "capital"]
        ), f"Expected 'response', 'answer', or 'capital' key in {response}"

        # If 'response' or 'answer' key is present, check its content
        if "response" in response:
            assert (
                "Madrid" in response["response"]
            ), f"Expected 'Madrid' in response: {response}"
        elif "answer" in response:
            assert (
                "Madrid" in response["answer"]
            ), f"Expected 'Madrid' in answer: {response}"
        else:
            assert (
                "Madrid" in response["capital"]
            ), f"Expected 'Madrid' in capital: {response}"
    else:
        assert isinstance(response, str), f"Expected str, got {type(response)}"
        assert "Madrid" in response, f"Expected 'Madrid' in response: {response}"


def test_openai_stream_mode(openai_api):
    openai_api.stream = True
    response = openai_api.chat("Count from 1 to 5.")
    assert isinstance(response, str)
    assert "1" in response and "5" in response


def test_openai_system_message(openai_api):
    openai_api.set_system_message(
        "You are a helpful assistant that speaks like a pirate."
    )
    response = openai_api.chat("Hello, how are you?")
    assert isinstance(response, str)
    assert "arr" in response.lower() or "matey" in response.lower()
