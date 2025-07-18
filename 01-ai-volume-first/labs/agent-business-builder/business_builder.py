import logging
from functools import wraps

from openai import OpenAI

"""
This module provides a framework for interacting with the OpenAI API to assist users in business strategy development.
It utilizes decorators for error handling, specifically to manage empty responses from the API. The `handle_empty_response`
decorator wraps functions to log errors and return a user-friendly message when an empty response is received.
"""

# Configure logging to write to both console and file
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("output.log", mode="w")],
)
logger = logging.getLogger(__name__)

client = OpenAI()


# Define the error handling decorator
def handle_empty_response(func):
    """
    Decorator to handle empty responses from the OpenAI API.

    Logs an error message if the response is empty and returns a user-friendly error message.
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        response = func(*args, **kwargs)
        if not response:
            logger.error("Received an empty response from OpenAI API")
            return "Error: Received an empty response."
        return response

    return wrapper


@handle_empty_response
def get_completion(messages):
    """
    Sends a request to the OpenAI API and retrieves a completion based on the provided messages.

    Args:
        messages (list): A list of messages to send to the API.

    Returns:
        str: The content of the completion response.
    """
    logger.info("Sending request to OpenAI API")
    completion = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=messages,
    )
    logger.info("Received response from OpenAI API")
    return completion.choices[0].message.content


@handle_empty_response
def clarity_agent(user_input):
    """
    Processes user input to generate clarifying questions using the OpenAI API.

    Args:
        user_input (str): The input provided by the user.

    Returns:
        str: The generated response from the clarity agent.
    """
    logger.info("Clarity Agent: Processing user input")
    messages = [
        {
            "role": "system",
            "content": (
                "You are a clarity agent. "
                "Your job is to ask questions to clarify the user's business needs."
            ),
        },
        {
            "role": "user",
            "content": f"Based on this input, ask 1 clarifying questions: {user_input}",
        },
    ]
    response = get_completion(messages)
    logger.info("Clarity Agent: Generated response")
    return response


@handle_empty_response
def niche_agent(user_input):
    """
    Processes user input to suggest a niche and describe the ideal target avatar using the OpenAI API.

    Args:
        user_input (str): The input provided by the user.

    Returns:
        str: The generated response from the niche agent.
    """
    logger.info("Niche Agent: Processing user input")
    messages = [
        {
            "role": "system",
            "content": "You are a niche agent. Your job is to generate niche content and identify the ideal target avatar.",
        },
        {
            "role": "user",
            "content": (
                f"Based on this input, suggest a niche and describe the ideal target avatar: "
                f"{user_input}"
            ),
        },
    ]
    response = get_completion(messages)
    logger.info("Niche Agent: Generated response")
    return response


@handle_empty_response
def action_agent(user_input):
    """
    Processes user input to provide specific actions the user should take using the OpenAI API.

    Args:
        user_input (str): The input provided by the user.

    Returns:
        str: The generated response from the action agent.
    """
    logger.info("Action Agent: Processing user input")
    messages = [
        {
            "role": "system",
            "content": "You are an action agent. Your job is to deliver precise, impactful, and actionable steps that the user can implement immediately to achieve their goals.",
        },
        {
            "role": "user",
            "content": f"Based on this input, provide 3 specific actions the user should take: {user_input}",
        },
    ]
    response = get_completion(messages)
    logger.info("Action Agent: Generated response")
    return response


@handle_empty_response
def business_strategist(clarity_response, niche_response, action_response):
    """
    Synthesizes information from various agents to create a comprehensive business strategy.

    Args:
        clarity_response (str): The response from the clarity agent.
        niche_response (str): The response from the niche agent.
        action_response (str): The response from the action agent.

    Returns:
        str: The synthesized business strategy.
    """
    logger.info("Business Strategist: Synthesizing information")
    messages = [
        {
            "role": "system",
            "content": "You are a business strategist. Your role is to integrate diverse insights and craft a comprehensive, strategic roadmap that aligns with the user's business objectives and drives sustainable growth.",
        },
        {
            "role": "user",
            "content": f"Synthesize the following information into a clear, concise business strategy:\n\nClarity: {clarity_response}\n\nNiche: {niche_response}\n\nActions: {action_response}",
        },
    ]
    response = get_completion(messages)
    logger.info("Business Strategist: Generated strategy")
    return response


def get_user_input(prompt):
    """
    Prompts the user for input and returns the response.

    Args:
        prompt (str): The message to display to the user.

    Returns:
        str: The user's input.
    """
    print(prompt)
    return input()


def process_pipeline(user_input):
    logger.info("Starting pipeline process")

    clarity_response = clarity_agent(user_input)
    logger.info(f"Clarity Agent Response: {clarity_response}")

    niche_response = niche_agent(user_input)
    logger.info(f"Niche Agent Response: {niche_response}")

    action_response = action_agent(user_input)
    logger.info(f"Action Agent Response: {action_response}")

    strategy = business_strategist(clarity_response, niche_response, action_response)
    logger.info(f"Business Strategy: {strategy}")

    return strategy


def main():
    logger.info("Starting Business Builder process")
    initial_prompt = "Tell me about your business idea or current business:"
    user_input = get_user_input(initial_prompt)
    logger.info(f"Received initial user input: {user_input}")

    strategy = process_pipeline(user_input)

    # Write the strategy to a markdown file
    with open("strategy.md", "w") as file:
        file.write("# Business Strategy\n\n")
        file.write(strategy)

    logger.info("Business Builder process completed, strategy written to strategy.md")


if __name__ == "__main__":
    main()
