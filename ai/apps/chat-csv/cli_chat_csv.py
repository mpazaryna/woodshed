from langchain_experimental.agents.agent_toolkits.csv.base import create_csv_agent
from langchain_openai import OpenAI
from langchain_community.output_parsers.rail_parser import GuardrailsOutputParser

def main():

    csv_file_path = input("Enter the path to your CSV file: ")

    if csv_file_path:
        try:
            with open(csv_file_path, "rb") as csv_file:
                agent = create_csv_agent(OpenAI(temperature=0), csv_file, verbose=True)

                user_question = input("Ask a question about your CSV: ")

                if user_question:
                    print(agent.invoke(user_question))
                else:
                    print("No question was asked.")
        except FileNotFoundError:
            print(f"The file {csv_file_path} was not found.")
    else:
        print("No CSV file was specified.")


if __name__ == "__main__":
    main()
