"""
Flexible Chat Module

This module provides a flexible chat interface that supports multiple AI providers.
It includes functions for managing providers, handling user input, and facilitating
chat interactions. The module is designed to be used as part of a larger application
that allows users to switch between different AI chat providers seamlessly.

Key Features:
- Support for multiple AI providers (OpenAI, Groq, OpenRouter)
- Dynamic provider selection
- Error handling for user input
- Streaming chat responses

Usage:
This module is typically used in conjunction with a main script that handles the
overall flow of the chat application. The functions here provide the core
functionality for provider management and chat interactions.

Dependencies:
- groq_handler: Provides Groq-specific chat handling
- openai_handler: Provides OpenAI-specific chat handling

Environment Variables:
- OPENAI_API_KEY: API key for OpenAI
- GROQ_API_KEY: API key for Groq
- OPENROUTER_API_KEY: API key for OpenRouter

Logging:
This module logs chat interactions to a file named 'universal_chat.log'.
"""

import logging
from os import getenv
from typing import Any, Dict, List, Tuple

from .groq_handler import Groq, handle_groq
from .openai_handler import OpenAI, handle_openai

EXIT_MESSAGE = "Exiting chat."
INVALID_INPUT_MESSAGE = "Invalid input. Please enter a valid number or '/quit' to exit."


# Configure logging
logging.basicConfig(
    filename="universal_chat.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


def get_providers() -> Dict[int, Tuple[str, Any]]:
    """
    Retrieves and initializes available chat providers.

    This function creates instances of supported chat providers using
    environment variables for API keys. It returns a dictionary mapping
    integer keys to tuples containing the provider name and its initialized client.

    Returns:
        Dict[int, Tuple[str, Any]]: A dictionary where the key is an integer
        identifier, and the value is a tuple containing the provider name (str)
        and the initialized client object (Any).

    Environment Variables:
        OPENAI_API_KEY: API key for OpenAI
        GROQ_API_KEY: API key for Groq
        OPENROUTER_API_KEY: API key for OpenRouter

    Example:
        {
            1: ("OpenAI", <OpenAI client instance>),
            2: ("Groq", <Groq client instance>),
            3: ("OpenRouter", <OpenAI client instance for OpenRouter>)
        }
    """
    return {
        1: ("OpenAI", OpenAI(api_key=getenv("OPENAI_API_KEY"))),
        2: ("Groq", Groq(api_key=getenv("GROQ_API_KEY"))),
        3: (
            "OpenRouter",
            OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=getenv("OPENROUTER_API_KEY"),
            ),
        ),
    }


def get_available_providers(providers: Dict[int, Tuple[str, Any]]) -> List[str]:
    """
    Extracts a list of available provider names from the providers dictionary.

    Args:
        providers (Dict[int, Tuple[str, Any]]): A dictionary of providers,
            where each value is a tuple containing the provider name and client.

    Returns:
        List[str]: A list of provider names.

    Example:
        >>> providers = {1: ("OpenAI", <client>), 2: ("Groq", <client>)}
        >>> get_available_providers(providers)
        ["OpenAI", "Groq"]
    """
    return [name for _, (name, _) in providers.items()]


def chat(
    provider_name: str,
    providers: Dict[int, Tuple[str, Any]],
    messages: List[Dict[str, str]],
) -> str:
    """
    Handles a chat interaction with the selected provider.

    This function takes a provider name, selects the appropriate handler,
    and processes the chat messages to generate a response.

    Args:
        provider_name (str): The name of the selected provider.
        providers (Dict[int, Tuple[str, Any]]): A dictionary of available providers.
        messages (List[Dict[str, str]]): A list of message dictionaries,
            each containing 'role' and 'content' keys.

    Returns:
        str: The generated assistant response.

    Raises:
        ValueError: If an unsupported provider is specified.

    Example:
        >>> providers = get_providers()
        >>> messages = [{"role": "user", "content": "Hello, AI!"}]
        >>> response = chat("OpenAI", providers, messages)
        >>> print(response)
        "Hello! How can I assist you today?"
    """
    provider_handlers = {
        "OpenAI": handle_openai,
        "OpenRouter": handle_openai,
        "Groq": handle_groq,
    }

    if provider_name not in provider_handlers:
        raise ValueError(f"Unsupported provider: {provider_name}")

    client = next(
        client for _, (name, client) in providers.items() if name == provider_name
    )
    stream = provider_handlers[provider_name](client, messages)

    assistant_response = ""
    for chunk in stream:
        if hasattr(chunk, "choices") and chunk.choices[0].delta is not None:
            content = chunk.choices[0].delta.content
        else:
            content = chunk
        assistant_response += str(content)

    return assistant_response


def chat_loop(providers: Dict[int, Tuple[str, Any]], provider_name: str):
    """
    Manages the main chat loop for interacting with a selected provider.

    This function handles user input, sends messages to the chat function,
    and prints responses. It continues until the user chooses to quit or switch providers.

    Args:
        providers (Dict[int, Tuple[str, Any]]): A dictionary of available providers.
        provider_name (str): The name of the currently selected provider.

    Returns:
        str or None: Returns "switch" if the user wants to switch providers,
            None if the chat session ends normally.

    Example:
        >>> providers = get_providers()
        >>> chat_loop(providers, "OpenAI")
        User: Hello, AI!
        Assistant: Hello! How can I assist you today?
        User: /quit
        Exiting chat.
    """
    messages = [{"role": "system", "content": "You are a helpful assistant."}]

    while True:
        user_input = input("User: ")

        if user_input.lower() == "switch":
            return "switch"
        if user_input.lower() == "/quit":
            print(EXIT_MESSAGE)
            break

        messages.append({"role": "user", "content": user_input})

        assistant_response = chat(provider_name, providers, messages)
        print("Assistant:", assistant_response)

        messages.append({"role": "assistant", "content": assistant_response})
        print()


def error_handler(func):
    """
    Decorator to handle errors in user input.

    This decorator wraps a function and catches ValueError exceptions,
    prompting the user to enter valid input.

    Args:
        func (callable): The function to be wrapped.

    Returns:
        callable: The wrapped function with error handling.

    Example:
        @error_handler
        def get_user_choice():
            choice = int(input("Enter a number: "))
            return choice
    """

    def wrapper(*args, **kwargs):
        while True:
            try:
                return func(*args, **kwargs)
            except ValueError:
                print(INVALID_INPUT_MESSAGE)

    return wrapper


@error_handler
def select_provider(providers: Dict[int, Tuple[str, Any]]) -> str:
    """
    Prompts the user to select a chat provider from the available options.

    This function displays a list of available providers and asks the user
    to select one by entering a number. It includes error handling for invalid inputs.

    Args:
        providers (Dict[int, Tuple[str, Any]]): A dictionary of available providers.

    Returns:
        str: The name of the selected provider.

    Raises:
        SystemExit: If the user enters '/quit' to exit the application.

    Example:
        >>> providers = get_providers()
        >>> selected_provider = select_provider(providers)
        Select a provider:
        1. OpenAI
        2. Groq
        3. OpenRouter
        Enter the number of the provider: 1
        >>> print(selected_provider)
        "OpenAI"
    """
    available_providers = get_available_providers(providers)
    print("Select a provider:")
    for i, name in enumerate(available_providers, 1):
        print(f"{i}. {name}")

    while True:
        choice = input("Enter the number of the provider: ")

        if choice.lower() == "/quit":
            print(EXIT_MESSAGE)
            raise SystemExit

        choice = int(choice)
        if 1 <= choice <= len(available_providers):
            return available_providers[choice - 1]
