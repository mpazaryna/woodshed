"""
This module provides a CLI interface for querying CSV files using a language model.
It uses LangChain to create an agent capable of answering questions about the CSV data.
"""

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
    return create_csv_agent(OpenAI(temperature=0), csv_file, verbose=True)


@log_warnings(logger_name="chat_csv_logger", log_file="logs/chat_csv_warnings.log")
def main(csv_file_path=None, user_question=None):
    if csv_file_path is None:
        csv_file_path = input("Enter the path to your CSV file: ")

    if csv_file_path:
        try:
            with open(csv_file_path, "rb") as csv_file:
                agent = create_agent(csv_file)

                if user_question is None:
                    user_question = input("Ask a question about your CSV: ")

                if user_question:
                    return agent.invoke(user_question)
                else:
                    return "No question was asked."
        except FileNotFoundError:
            return f"The file {csv_file_path} was not found."
    else:
        return "No CSV file was specified."


if __name__ == "__main__":
    result = main()
    print(result)
