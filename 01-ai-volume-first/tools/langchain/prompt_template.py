from langchain_core.prompts import PromptTemplate


def run_prompt_template_demo():
    """
    Demonstrates the use of the PromptTemplate class from the langchain_core.prompts module.

    This function creates a prompt template with a specified input variable and template string.
    It then formats the template with a given product name and returns the formatted string.

    Returns:
        str: A formatted string with the product name inserted into the template.
    """
    prompt = PromptTemplate(
        input_variables=["product"],
        template="What is a good name for a company that makes {product}?",
    )
    return prompt.format(product="Smart Apps using Large Language Models (LLMs)")


if __name__ == "__main__":
    """
    Entry point of the script.

    This block of code will execute when the script is run directly. It calls the
    run_prompt_template_demo function and prints the result to the console.
    """
    print(run_prompt_template_demo())
