from langchain_core.prompts import PromptTemplate

def run_prompt_template_demo():
    prompt = PromptTemplate(
        input_variables=["product"],
        template="What is a good name for a company that makes {product}?",
    )
    return prompt.format(product="Smart Apps using Large Language Models (LLMs)")


if __name__ == "__main__":
    print(run_prompt_template_demo())
