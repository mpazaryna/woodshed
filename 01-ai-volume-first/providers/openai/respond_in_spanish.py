import os
from typing import Dict, List

from openai import OpenAI
from openai.types.chat import ChatCompletion


def get_spanish_response(prompt: str) -> str:
    """
    Get a response in Spanish from the OpenAI API about a historical event.

    This function sends a request to the OpenAI API with a system message instructing
    the model to respond in Spanish and Markdown format, and a user message containing
    the provided prompt.

    Args:
        prompt (str): The user's question about a historical event.

    Returns:
        str: The model's response in Spanish and Markdown format.

    Raises:
        openai.OpenAIError: If there's an error with the OpenAI API request.
        Exception: For any other unexpected errors.
    """
    client = OpenAI()
    MODEL = "gpt-4"  # Updated from "gpt-4o" to "gpt-4"

    try:
        completion: ChatCompletion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that knows a lot about history. Please respond in Markdown and Spanish.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            model=MODEL,
        )
        return completion.choices[0].message.content
    except openai.OpenAIError as e:
        print(f"Error with OpenAI API: {e}")
        raise
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise


def main():
    """
    Main function to demonstrate the use of get_spanish_response.
    """
    prompt = "What are some of the key events that happened in March 2021?"
    try:
        response = get_spanish_response(prompt)
        print(response)
    except Exception as e:
        print(f"Failed to get response: {e}")


if __name__ == "__main__":
    main()
