from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate

# Function to load prompt template from file
def load_prompt_template(file_path):
    with open(file_path, "r") as file:
        return file.read()

def main():

    template = load_prompt_template("prompt_template.txt")
    prompt = PromptTemplate.from_template(template)

    llm = OpenAI(model_name="gpt-3.5-turbo-instruct")
    llm_chain = prompt | llm

    question = "What NFL team won the Super Bowl in the year Barack Obama was born?"
    response = llm_chain.invoke(question)
    print(response)


if __name__ == "__main__":
    main()
