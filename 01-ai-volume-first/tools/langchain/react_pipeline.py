"""
langchain_pipeline.py

This module provides functionality to create and run a pipeline that utilizes
OpenAI's language model and Google search capabilities to answer queries about
historical figures, specifically their ages and related mathematical computations.

Modules:
- logging: For logging information and errors.
- os: For interacting with the operating system.
- re: For regular expression operations.
- pathlib: For handling filesystem paths.
- dotenv: For loading environment variables from a .env file.
- langchain: For utilizing language model chains and utilities.

Functions:
- load_environment: Loads environment variables and retrieves the OpenAI API key.
- create_llm: Creates an instance of the OpenAI language model.
- create_pipeline: Constructs the pipeline using the language model and search utilities.
- run_pipeline: Executes the pipeline for a given query and returns the result.
- main: The main entry point of the script that orchestrates the loading of the environment,
  creation of the LLM, and execution of the pipeline.
"""

import logging
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.callbacks import get_openai_callback
from langchain_community.utilities import GoogleSerperAPIWrapper
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import OpenAI

from langchain.chains import LLMMathChain

# Create logs directory if it doesn't exist
log_dir = Path(__file__).parent.parent.parent / "logs"
log_dir.mkdir(exist_ok=True)

# Configure logging
log_file = log_dir / "langchain_pipeline.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    filename=log_file,
    filemode="a",
)
logger = logging.getLogger(__name__)


def load_environment():
    """
    Load environment variables from a .env file and retrieve the OpenAI API key.

    Returns:
        str: The OpenAI API key.

    Raises:
        ValueError: If the OpenAI API key is not found in the environment variables.
    """
    logger.info("Loading environment variables")
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OpenAI API key not found in environment variables")
        raise ValueError("OpenAI API key not found in environment variables.")
    logger.info("Environment variables loaded successfully")
    return api_key


def create_llm(api_key):
    """
    Create an instance of the OpenAI language model.

    Args:
        api_key (str): The OpenAI API key.

    Returns:
        OpenAI: An instance of the OpenAI language model.
    """
    logger.info("Creating LLM instance")
    return OpenAI(api_key=api_key, model_name="gpt-3.5-turbo-instruct", temperature=0)


def create_pipeline(llm):
    """
    Create the pipeline using the provided language model and search utilities.

    Args:
        llm (OpenAI): The OpenAI language model instance.

    Returns:
        tuple: A tuple containing the Google search utility, math chain, and search chain.
    """
    logger.info("Creating pipeline")
    google_search = GoogleSerperAPIWrapper()

    # Use the from_llm class method to create LLMMathChain
    math_chain = LLMMathChain.from_llm(llm=llm)

    search_prompt = PromptTemplate(
        input_variables=["query"],
        template="Search for information about {query} and provide a concise answer.",
    )

    # Replace LLMChain with RunnableSequence
    search_chain = search_prompt | llm

    logger.info("Pipeline created successfully")
    return google_search, math_chain, search_chain


def run_pipeline(google_search, math_chain, search_chain, query):
    """
    Execute the pipeline for a given query and return the result.

    Args:
        google_search (GoogleSerperAPIWrapper): The Google search utility.
        math_chain (LLMMathChain): The math chain for computations.
        search_chain (RunnableSequence): The search chain for processing queries.
        query (str): The query to be processed.

    Returns:
        str: The result of the pipeline execution, including the age and mathematical computation.
    """
    logger.info(f"Running pipeline for query: {query}")
    with get_openai_callback() as cb:
        # Step 1: Search for Van Gogh's age
        search_result = google_search.run(f"Vincent van Gogh age at death")

        # Step 2: Extract the age using LLM
        age_query = f"How old was {query} when he died?"
        age_result = search_chain.invoke({"query": age_query})

        # Add this part to process the math query
        age = int(re.search(r"\d+", age_result).group())
        math_query = f"What is {age} raised to the 0.25 power?"
        math_result = math_chain.invoke(math_query)

        logger.info(f"Total Tokens: {cb.total_tokens}")
        logger.info(f"Prompt Tokens: {cb.prompt_tokens}")
        logger.info(f"Completion Tokens: {cb.completion_tokens}")
        logger.info(f"Total Cost (USD): ${cb.total_cost}")

    return f"{age_result}\nAnswer: {math_result}"


def main():
    try:
        api_key = load_environment()
        llm = create_llm(api_key)
        google_search, math_chain, search_chain = create_pipeline(llm)

        query = "How old was Vincent van Gogh when he died? What is his age raised to the 0.25 power?"
        result = run_pipeline(google_search, math_chain, search_chain, query)

        logger.info("Pipeline Result:")
        logger.info(result)

        print("Pipeline Result:")
        print(result)
    except Exception as e:
        logger.exception(f"An error occurred: {str(e)}")
        print(f"An error occurred. Please check the log file for details.")


if __name__ == "__main__":
    main()
