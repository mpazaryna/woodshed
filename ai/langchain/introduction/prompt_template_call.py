# prompt_template_call.py
from dotenv import find_dotenv, load_dotenv

from langchain_core.prompts import PromptTemplate

load_dotenv(find_dotenv())


def run_prompt_template_demo():
    prompt = PromptTemplate(
        input_variables=["product"],
        template="What is a good name for a company that makes {product}?",
    )
    return prompt.format(product="Smart Apps using Large Language Models (LLMs)")


if __name__ == "__main__":
    print(run_prompt_template_demo())
