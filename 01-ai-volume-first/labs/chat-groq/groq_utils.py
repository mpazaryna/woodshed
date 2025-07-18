# groq_utils.py

from typing import Generator

from groq import Groq


def create_groq_client() -> Groq:
    """Create and return a Groq client instance."""
    return Groq()


def generate_chat_responses(chat_completion) -> Generator[str, None, None]:
    """Yield chat response content from the Groq API response."""
    for chunk in chat_completion:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


def fetch_groq_response(client, model_option, messages, max_tokens):
    """Fetch response from Groq API."""
    return client.chat.completions.create(
        model=model_option,
        messages=messages,
        max_tokens=max_tokens,
        stream=True,
    )
