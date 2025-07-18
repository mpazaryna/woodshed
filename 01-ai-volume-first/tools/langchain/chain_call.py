from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI


def chain_demo():
    llm = OpenAI()
    prompt = PromptTemplate(
        input_variables=["product"],
        template="What is a good name for a company that makes {product}?",
    )

    chain = prompt | llm
    return chain.invoke({"product": "AI Chatbots for Podiatry Offices"})


if __name__ == "__main__":
    print(chain_demo())
