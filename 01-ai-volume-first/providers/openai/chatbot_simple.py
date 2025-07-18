"""
A simple chatbot using OpenAI's GPT-3.5-turbo model.

This script demonstrates a basic conversation loop with an AI assistant.
It uses the OpenAI API to generate responses based on user input.
The conversation starts with a system message defining the assistant's role,
and then alternates between user input and AI-generated responses.
"""

import os

from openai import OpenAI


def initialize_conversation():
    """Initialize the conversation with a system message."""
    return [
        {"role": "system", "content": "You are a helpful assistant."},
    ]


def get_user_input():
    """Prompt the user for input and return their message."""
    return input("User: ")


def generate_ai_response(client, messages):
    """Generate an AI response using the OpenAI API."""
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages)
    return response.choices[0].message.content


def print_welcome_message():
    """Print a welcome message with instructions."""
    print("Welcome to the AI Chatbot!")
    print("You can have a conversation with the AI assistant.")
    print("To exit the chat, type 'exit', 'quit', or 'bye'.")
    print("Let's begin!\n")


def main():
    # Initialize the OpenAI client
    client = OpenAI()

    # Print welcome message and instructions
    print_welcome_message()

    # Start the conversation
    messages = initialize_conversation()

    while True:
        # Get user input
        user_message = get_user_input()

        # Check if the user wants to exit
        if user_message.lower() in ["exit", "quit", "bye"]:
            print(
                "Assistant: Goodbye! Thank you for chatting with me. Have a great day!"
            )
            break

        # Append user message to conversation
        messages.append({"role": "user", "content": user_message})

        # Generate AI response
        assistant_message = generate_ai_response(client, messages)

        # Print the assistant message
        print(f"Assistant: {assistant_message}")

        # Append assistant message to conversation
        messages.append({"role": "assistant", "content": assistant_message})


if __name__ == "__main__":
    main()
