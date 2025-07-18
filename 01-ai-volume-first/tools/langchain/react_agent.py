"""
LangChain React Agent Module

This module implements a LangChain-based React agent that can answer complex queries
using a combination of Google Search and mathematical operations. It demonstrates the
use of LangChain's agent capabilities, tool integration, and OpenAI's language model.

The agent is capable of breaking down complex queries, searching for information,
performing calculations, and providing comprehensive answers.

Usage:
    Run this script directly to process a predefined query about Vincent van Gogh's age
    and a related mathematical calculation. You can also import the functions to use
    in other scripts.

    python langchain_react.py

Dependencies:
    - langchain
    - langchain_openai
    - python-dotenv (optional, for loading environment variables)

Environment Variables:
    - OPENAI_API_KEY: Your OpenAI API key (required)
    - SERPER_API_KEY: Your Serper API key for Google Search (required for the google-serper tool)

Author: [Your Name]
Date: [Current Date]
Version: 1.1
"""

import logging
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

from langchain_community.agent_toolkits.load_tools import load_tools
from langchain_community.callbacks import get_openai_callback
from langchain_core.tools import BaseTool
from langchain_openai import OpenAI

from langchain.agents import AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate

# Uncomment the following line if you're using python-dotenv to load environment variables
# from dotenv import load_dotenv

# Create logs directory if it doesn't exist
log_dir = Path(__file__).parent.parent.parent / "logs"
log_dir.mkdir(exist_ok=True)

# Configure logging
log_file = log_dir / "langchain_react.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    filename=log_file,
    filemode="a",
)
logger = logging.getLogger(__name__)


def load_environment() -> Dict[str, str]:
    """
    Load environment variables and return a dictionary of required API keys.

    Returns:
        Dict[str, str]: A dictionary containing the required API keys.

    Raises:
        ValueError: If any required API key is not found in the environment variables.
    """
    logger.info("Loading environment variables")
    # Uncomment the following line if you're using python-dotenv
    # load_dotenv()

    required_keys = ["OPENAI_API_KEY", "SERPER_API_KEY"]
    env_vars = {}

    for key in required_keys:
        value = os.getenv(key)
        if not value:
            logger.error(f"{key} not found in environment variables")
            raise ValueError(f"{key} not found in environment variables")
        env_vars[key] = value

    logger.info("Environment variables loaded successfully")
    return env_vars


def create_llm(
    api_key: str, model_name: str = "gpt-3.5-turbo-instruct", temperature: float = 0
) -> OpenAI:
    """
    Create and return an instance of the OpenAI language model.

    Args:
        api_key (str): The OpenAI API key.
        model_name (str, optional): The name of the OpenAI model to use. Defaults to "gpt-3.5-turbo-instruct".
        temperature (float, optional): The temperature setting for the model. Defaults to 0.

    Returns:
        OpenAI: An instance of the OpenAI language model.
    """
    logger.info(f"Creating LLM instance with model: {model_name}")
    return OpenAI(api_key=api_key, model_name=model_name, temperature=temperature)


def create_agent(llm: OpenAI, tools: Optional[List[BaseTool]] = None) -> AgentExecutor:
    """
    Create and return a LangChain React agent with specified tools.

    Args:
        llm (OpenAI): An instance of the OpenAI language model.
        tools (Optional[List[BaseTool]], optional): A list of tools to be used by the agent.
                                                    If None, default tools will be loaded.

    Returns:
        AgentExecutor: An initialized React agent.
    """
    logger.info("Creating agent")
    if tools is None:
        tools = load_tools(["google-serper", "llm-math"], llm=llm)

    prompt = PromptTemplate.from_template(
        """Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought: {agent_scratchpad}"""
    )

    agent = create_react_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

    logger.info("Agent created successfully")
    return agent_executor


def run_query(agent: AgentExecutor, query: str) -> Dict[str, Any]:
    """
    Run a query using the provided agent and log the results.

    Args:
        agent (AgentExecutor): The initialized React agent.
        query (str): The query to be processed by the agent.

    Returns:
        Dict[str, Any]: The result of the agent's execution.
    """
    logger.info(f"Running query: {query}")
    with get_openai_callback() as cb:
        result = agent.invoke({"input": query})
        logger.info(f"Total Tokens: {cb.total_tokens}")
        logger.info(f"Prompt Tokens: {cb.prompt_tokens}")
        logger.info(f"Completion Tokens: {cb.completion_tokens}")
        logger.info(f"Total Cost (USD): ${cb.total_cost}")
    return result


def main():
    """
    Main function to demonstrate the usage of the LangChain React agent.

    This function loads the environment, creates the language model and agent,
    runs a predefined query, and logs the results.
    """
    try:
        env_vars = load_environment()
        llm = create_llm(env_vars["OPENAI_API_KEY"])
        agent = create_agent(llm)

        query = "How old was Vincent van Gogh when he died? What is his age raised to the 0.25 power?"
        result = run_query(agent, query)

        logger.info("Query Result:")
        logger.info(result)

        print("Query Result:")
        print(result)
    except Exception as e:
        logger.exception(f"An error occurred: {str(e)}")
        print(f"An error occurred. Please check the log file for details.")


if __name__ == "__main__":
    main()
