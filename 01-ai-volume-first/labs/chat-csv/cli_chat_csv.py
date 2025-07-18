"""
This module provides a CLI interface for querying CSV files using a language model.
It uses LangChain to create an agent capable of answering questions about the CSV data.
"""

import os

from langchain_community.output_parsers.rail_parser import GuardrailsOutputParser
from langchain_experimental.agents.agent_toolkits.csv.base import create_csv_agent
from langchain_openai import OpenAI
from warning_logger import log_warnings


def create_agent(csv_file):
    """
    Create a LangChain agent for querying CSV files.

    Args:
        csv_file (file): An open file object containing CSV data.

    Returns:
        Agent: A LangChain agent capable of answering questions about the CSV data.
    """
    return create_csv_agent(
        OpenAI(temperature=0), csv_file, verbose=True, allow_dangerous_code=True
    )


@log_warnings(logger_name="chat_csv_logger", log_file="logs/chat_csv_warnings.log")
def main(csv_file_path, question):
    if not os.path.exists(csv_file_path):
        return {"error": f"The file {csv_file_path} was not found."}

    try:
        with open(csv_file_path, "rb") as csv_file:
            agent = create_agent(csv_file)

            if question is None:
                question = input("Ask a question about your CSV: ")

            if question:
                return agent.invoke(question)
            else:
                return "No question was asked."
    except FileNotFoundError:
        return f"The file {csv_file_path} was not found."


if __name__ == "__main__":
    result = main()
    print(result)
