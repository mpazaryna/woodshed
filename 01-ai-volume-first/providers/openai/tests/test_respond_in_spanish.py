import pytest

from woodshed.integrations.providers.openai.respond_in_spanish import (
    get_spanish_response,
)


def is_spanish(text):
    """
    Simple check to determine if the text is likely Spanish.
    This is not foolproof but should work for our test purposes.
    """
    spanish_words = [
        "el",
        "la",
        "los",
        "las",
        "un",
        "una",
        "y",
        "en",
        "de",
        "que",
        "es",
    ]
    words = text.lower().split()
    return any(word in spanish_words for word in words)


def contains_markdown(text):
    """
    Check if the text contains common Markdown formatting.
    """
    markdown_patterns = ["#", "##", "**", "*", "`", "```", "- ", "1. "]
    return any(pattern in text for pattern in markdown_patterns)


def test_get_spanish_response():
    prompt = "What are some key events that happened in March 2021?"
    response = get_spanish_response(prompt)

    assert response, "Response should not be empty"
    assert is_spanish(response), "Response should be in Spanish"
    assert contains_markdown(response), "Response should contain Markdown formatting"
