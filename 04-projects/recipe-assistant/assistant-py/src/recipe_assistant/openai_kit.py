"""
This module provides functionality for generating insights from recipe data using OpenAI's language model.

It utilizes the LangChain library to interact with OpenAI's API and process recipe information.
The module includes logging capabilities for tracking the execution flow and debugging purposes.
"""

import logging

from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough
from langchain_openai import ChatOpenAI

from recipe_assistant.logger_config import setup_logger

logger = setup_logger(__name__, logging.INFO, "app.log")


def generate_insights(recipes):
    """
    Generate insights from a given set of recipes using OpenAI's language model.

    This function takes a summary of recipe data as input and uses OpenAI's GPT model to generate
    insights about trends in cuisine types, popular ingredients, and cooking methods. It aims to
    provide exactly 5 concise insights, formatted as 'Insight X: Your insight here'.

    Args:
        recipes (str): A string containing a summary of recipe data.

    Returns:
        dict: A dictionary containing at least 3 insights. Keys are formatted as 'insight_1',
              'insight_2', etc., and values are the corresponding insight texts.

    Logs:
        - Function start and end
        - Input recipes
        - Generated insights from OpenAI
        - Parsed insights

    Note:
        If the OpenAI model generates fewer than 3 insights, the function will pad the result
        with placeholder insights to ensure at least 3 are returned.
    """
    logger.info("Starting generate_insights function")
    logger.info(f"Input recipes: {recipes}")

    llm = ChatOpenAI(temperature=0.7)
    prompt = PromptTemplate(
        input_variables=["recipes"],
        template="Based on the following recipe data summary, please provide exactly 5 concise insights about trends in cuisine types, popular ingredients, and cooking methods. Format each insight as 'Insight X: Your insight here', where X is the number of the insight.\n\n{recipes}",
    )

    chain = {"recipes": RunnablePassthrough()} | prompt | llm | StrOutputParser()

    logger.info("Sending request to OpenAI")
    response = chain.invoke(recipes)

    logger.info(f"Generated insights from OpenAI: {response}")

    # Parse the response into a dictionary
    insights = {}
    for line in response.split("\n"):
        if line.startswith("Insight"):
            key, value = line.split(":", 1)
            insights[key.strip().lower().replace(" ", "_")] = value.strip()

    # Ensure we have at least 3 insights
    while len(insights) < 3:
        insights[f"insight_{len(insights) + 1}"] = "No insight provided"

    logger.info(f"Parsed insights: {insights}")
    logger.info("Finished generate_insights function")

    return insights
