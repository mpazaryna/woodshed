"""
This module provides functionality for generating poems using the Groq language model.
It supports creating haikus and limericks based on given topics.
"""

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq


def create_chat_groq(temperature=0, model_name="llama3-8b-8192"):
    """
    Create and return a ChatGroq instance with specified parameters.

    Args:
        temperature (float): The temperature for text generation. Defaults to 0.
        model_name (str): The name of the model to use. Defaults to "llama3-8b-8192".

    Returns:
        ChatGroq: An instance of ChatGroq with the specified settings.
    """
    return ChatGroq(temperature=temperature, model_name=model_name)


def create_prompt(system_message, user_input):
    """
    Create a ChatPromptTemplate with a system message and user input.

    Args:
        system_message (str): The system message to set the context.
        user_input (str): The user's input or topic.

    Returns:
        ChatPromptTemplate: A prompt template for the chat model.
    """
    return ChatPromptTemplate.from_messages(
        [("system", system_message), ("human", "{text}")]
    )


def create_poem(topic, poem_type):
    """
    Generate a poem based on the given topic and type.

    Args:
        topic (str): The subject of the poem.
        poem_type (str): The type of poem to generate ("haiku" or "limerick").

    Returns:
        str: The generated poem as a string.

    Raises:
        ValueError: If an unsupported poem type is provided.
    """
    if poem_type == "haiku":
        system_message = (
            "You are a wise poet and able to write the best haiku on any subject."
        )
    elif poem_type == "limerick":
        system_message = (
            "You are a poet able to write the most beautiful limerick on any subject."
        )
    else:
        raise ValueError("Unsupported poem type")

    prompt = create_prompt(system_message, topic)
    chat = create_chat_groq()
    chain = prompt | chat | StrOutputParser()
    output = chain.invoke({"text": topic})
    return output


def generate_poem(topic, poem_type):
    """
    Handle the poem generation and output formatting.

    Args:
        topic (str): The subject of the poem.
        poem_type (str): The type of poem to generate ("haiku" or "limerick").

    Returns:
        list: A list of strings, each representing a line of the generated poem.
    """
    output = create_poem(topic, poem_type)
    return output.splitlines()


# Example usage
# output = generate_poem("pickles", "haiku")
# print('\n'.join(output))
