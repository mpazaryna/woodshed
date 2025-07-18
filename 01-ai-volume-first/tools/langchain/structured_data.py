"""
This module demonstrates the use of a language model to generate and print jokes.

The module defines a data model for a joke using Pydantic, and includes functions
to generate a joke using the ChatOpenAI language model and print it to the console.
The joke consists of a setup, a punchline, and an optional rating of its humor.

Functions:
    get_joke(): Generates a joke using a language model and returns it as a Joke object.
    print_joke(): Retrieves a joke using get_joke() and prints it to the console.
"""

from typing import Optional

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field


# Define the Joke model
class Joke(BaseModel):
    """
    A data model representing a joke.

    Attributes:
        setup (str): The setup of the joke.
        punchline (str): The punchline of the joke.
        rating (Optional[int]): An optional rating of the joke's humor, from 1 to 10.
    """

    setup: str = Field(description="The setup of the joke")
    punchline: str = Field(description="The punchline to the joke")
    rating: Optional[int] = Field(
        default=None, description="How funny the joke is, from 1 to 10"
    )


# Function to get a joke
def get_joke():
    """
    Generates a joke using a language model.

    This function initializes a language model, requests a joke about cats,
    and returns the structured output as a Joke object.

    Returns:
        Joke: A Joke object containing the setup, punchline, and optional rating.
    """
    llm = ChatOpenAI(model="gpt-4o-mini")
    structured_llm = llm.with_structured_output(Joke)
    joke_output = structured_llm.invoke("Tell me a joke about cats")
    return joke_output


# Function to print the joke
def print_joke():
    """
    Prints a joke to the console.

    This function calls get_joke() to retrieve a joke and then prints the
    joke's setup, punchline, and optional rating to the console.
    """
    joke = get_joke()
    print(joke)


# Call the function to print the joke
print_joke()
