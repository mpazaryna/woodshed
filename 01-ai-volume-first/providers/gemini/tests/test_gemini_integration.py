import os

import pytest

from woodshed.integrations.providers.gemini.main import (
    configure_gemini,
    generate_content,
    get_model,
)


@pytest.fixture(scope="module")
def api_key():
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        pytest.skip("GOOGLE_API_KEY not set in environment variables")
    return api_key


def test_configure_gemini(api_key):
    configure_gemini()
    # If no exception is raised, we assume the configuration was successful


def test_get_model(api_key):
    configure_gemini()
    model = get_model()
    assert model is not None
    assert model.model_name == "models/gemini-1.5-pro-latest"


def test_generate_content(api_key):
    prompt = "What is the capital of France?"
    result = generate_content(prompt)
    assert result is not None
    assert (
        "Paris" in result
    ), f"Expected 'Paris' to be in the response, but got: {result}"


def test_generate_content_error_handling():
    # Test with an invalid API key to trigger error handling
    os.environ["GOOGLE_API_KEY"] = "invalid_key"
    prompt = "This should fail due to invalid API key"
    result = generate_content(prompt)
    assert result is None
    # Reset the environment variable
    if "GOOGLE_API_KEY" in os.environ:
        del os.environ["GOOGLE_API_KEY"]
