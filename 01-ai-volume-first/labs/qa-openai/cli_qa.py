from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate


def main():

    template = """Question: {question}
    Answer: Let's think step by step."""

    prompt = PromptTemplate.from_template(template)

    llm = OpenAI(model_name="gpt-3.5-turbo-instruct")

    llm_chain = prompt | llm

    question = "What NFL team won the Super Bowl in the year Barack Obama was born?"
    response = llm_chain.invoke(question)
    print(response)


if __name__ == "__main__":
    main()
