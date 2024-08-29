"""
Utility functions for interacting with chat models using the Groq API.

This module provides a function to retrieve chat completions from a list of available models.
"""

from groq import Groq

# Define available models
AVAILABLE_MODELS = [
    "llama3-8b-8192",
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
    "gemma-7b-it",
]


def get_chat_completion(models, content):
    """Get chat completions for a list of models.

    Args:
        models (list): A list of model names to retrieve completions for.
        content (str): The content to send as a message to the chat model.

    Returns:
        dict: A dictionary mapping model names to their respective chat completions.
    """
    # Initialize Groq client
    client = Groq()
    completions = {}

    # Iterate through the models
    for model_name in models:
        if model_name not in AVAILABLE_MODELS:
            print(f"Model {model_name} is not available.")
            continue
        try:
            # Create chat completion
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": content,
                    }
                ],
                model=model_name,
            )

            # Get the content of the first choice
            completion_content = chat_completion.choices[0].message.content
            completions[model_name] = (
                completion_content  # Store completion by model name
            )

        except Exception as e:
            print(
                f"An error occurred while getting chat completion for model {model_name}: {e}"
            )

    return completions
