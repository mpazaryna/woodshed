import os

from dotenv import load_dotenv

# from langchain_experimental.agents import create_csv_agent
from langchain_experimental.agents.agent_toolkits.csv.base import create_csv_agent

# from langchain.llms import OpenAI
from langchain_openai import OpenAI


def main():
    load_dotenv()

    # Load the OpenAI API key from the environment variable
    if os.getenv("OPENAI_API_KEY") is None or os.getenv("OPENAI_API_KEY") == "":
        print("OPENAI_API_KEY is not set")
        exit(1)
    else:
        print("OPENAI_API_KEY is set")

    # Ask for the CSV file name
    csv_file_path = input("Enter the path to your CSV file: ")

    if csv_file_path:
        try:
            with open(csv_file_path, "rb") as csv_file:
                agent = create_csv_agent(OpenAI(temperature=0), csv_file, verbose=True)

                # Ask the user for a question about the CSV
                user_question = input("Ask a question about your CSV: ")

                if user_question:
                    print(agent.run(user_question))
                else:
                    print("No question was asked.")
        except FileNotFoundError:
            print(f"The file {csv_file_path} was not found.")
    else:
        print("No CSV file was specified.")


if __name__ == "__main__":
    main()
