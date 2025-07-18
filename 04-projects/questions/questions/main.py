"""
Q&A Application (Parameter Object Version)

This module provides a command-line interface for users to ask questions.
It uses the Perplexity API to generate and answer related questions in parallel, providing
comprehensive insights into the user's financial query.
"""

import asyncio
import logging
import os
from dataclasses import dataclass
from datetime import datetime
from functools import lru_cache
from pathlib import Path
from typing import Callable, Dict, List, NamedTuple, Tuple

from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from openai import OpenAI

from .animation_utils import create_progress_animation
from .config import ConfigTuple
from .file_utils import save_results
from .io_utils import display_results, get_expert_type, get_user_question
from .prompts import local_prompts


@dataclass
class QuestionProcessingContext:
    """
    Encapsulates all parameters needed for processing a single question in the Q&A pipeline.

    This class consolidates related parameters that are commonly passed together through
    the question processing pipeline. Using a parameter object pattern provides several
    key benefits:

    1. Improved Readability:
       - Creates a cleaner, more focused function signature
       - Makes parameter relationships explicit through the data class structure
       - Clearly shows that these parameters form a cohesive unit for question processing

    2. Better Maintainability:
       - Centralizes parameter modifications in one place
       - Simplifies adding new parameters without changing function signatures
       - Provides a natural location for parameter validation logic
       - Reduces the likelihood of parameter ordering errors

    3. More Flexible Evolution:
       - Allows adding methods to the data class for common parameter operations
       - Simplifies passing context through multiple layers of the application
       - Enables adding optional parameters without breaking existing code
       - Makes it easier to version and modify the parameter set

    4. Documentation Benefits:
       - Centralizes parameter documentation in one location
       - Makes parameter relationships more explicit
       - Consolidates type hints and documentation

    Attributes:
        client (OpenAI): The OpenAI client instance for making API calls
        question (str): The user's input question to be processed
        expert_type (str): The type of expert providing the answer (e.g., "financial advisor")
        config (ConfigTuple): Configuration settings for the application
        start_animation (Callable): Function to start the progress animation
        stop_animation (Callable): Function to stop the progress animation
        prompts (Dict[str, PromptTemplate]): Prompt templates for generating related questions

    Example:
        context = QuestionProcessingContext(
            client=create_openai_client(config),
            question="What are the tax implications of remote work?",
            expert_type="tax expert",
            config=config,
            start_animation=animation_start_fn,
            stop_animation=animation_stop_fn,
            prompts=local_prompts
        )
        await process_single_question(context)
    """

    client: OpenAI
    question: str
    expert_type: str
    config: ConfigTuple
    start_animation: Callable
    stop_animation: Callable
    prompts: Dict[str, PromptTemplate]


def load_env_vars() -> str:
    """
    Load and validate the Perplexity API key from environment variables.

    Returns:
        str: The API key

    Raises:
        ValueError: If PERPLEXITY_API_KEY is not set
    """
    load_dotenv()
    key = os.getenv("PERPLEXITY_API_KEY")
    if not key:
        raise ValueError("PERPLEXITY_API_KEY environment variable is required")
    return key


@lru_cache(maxsize=1)
def get_config(log_to_file: bool = False) -> ConfigTuple:
    """
    Get application configuration with caching.

    Args:
        log_to_file (bool): Whether to log output to a file

    Returns:
        ConfigTuple: Immutable configuration object containing all settings
    """
    return ConfigTuple(
        perplexity_api_key=load_env_vars(),
        output_dir=Path("results"),
        log_file="app.log",
        log_to_file=log_to_file,
        model_name="llama-3.1-sonar-large-128k-online",
        base_url="https://api.perplexity.ai",
    )


def create_openai_client(config: ConfigTuple) -> OpenAI:
    """
    Create an OpenAI client with the provided configuration.

    Args:
        config (ConfigTuple): The configuration object containing API settings.

    Returns:
        OpenAI: An instance of the OpenAI client.
    """
    return OpenAI(api_key=config.perplexity_api_key, base_url=config.base_url)


def load_prompts(prompts_file: Path) -> Dict[str, PromptTemplate]:
    """Load prompt templates from local file"""
    namespace = {}
    exec(prompts_file.read_text(), namespace)
    return namespace.get("local_prompts", {})


def get_prompt(expert_type: str, prompts: Dict[str, PromptTemplate]) -> str:
    """Get formatted prompt for expert type"""
    template = prompts.get(expert_type)
    if not template:
        raise ValueError(f"No prompt template found for expert type: {expert_type}")
    return template.format()


async def generate_related_questions(
    context: QuestionProcessingContext,
    prompts: Dict[str, PromptTemplate],
) -> List[str]:
    """Generate related questions based on user input"""
    expert_prompt = get_prompt(context.expert_type, prompts)

    messages = [
        {"role": "system", "content": expert_prompt},
        {"role": "user", "content": context.question},
    ]

    response = context.client.chat.completions.create(
        model=context.config.model_name,
        messages=messages,
    )

    return [
        q.strip()
        for q in response.choices[0].message.content.split("\n")
        if q.strip() and any(q.strip().startswith(str(i)) for i in range(1, 6))
    ]


async def deprecated_generate_related_questions(
    context: QuestionProcessingContext,
    prompt_getter: Callable[[str], str] = get_prompt,
) -> List[str]:
    """
    Generate related questions based on the user's input question.

    Args:
        context (QuestionProcessingContext): The context object containing all necessary parameters
        prompt_getter (Callable[[str], str]): Function to get the expert prompt

    Returns:
        List[str]: A list of related questions generated by the model
    """
    expert_prompt = prompt_getter(context.expert_type)

    messages = [
        {"role": "system", "content": expert_prompt},
        {"role": "user", "content": context.question},
    ]

    response = context.client.chat.completions.create(
        model=context.config.model_name,
        messages=messages,
    )

    return [
        q.strip()
        for q in response.choices[0].message.content.split("\n")
        if q.strip() and any(q.strip().startswith(str(i)) for i in range(1, 6))
    ]


async def get_answer(context: QuestionProcessingContext, question: str) -> Dict:
    """
    Get an answer for a specific question using the Perplexity API.

    Args:
        context (QuestionProcessingContext): The context object containing all necessary parameters
        question (str): The specific question to answer

    Returns:
        Dict: A dictionary containing the question and its answer
    """
    messages = [
        {
            "role": "system",
            "content": (
                f"You are a {context.expert_type}. Provide a clear, concise, and accurate "
                "answer to the following question."
            ),
        },
        {"role": "user", "content": question},
    ]

    response = context.client.chat.completions.create(
        model=context.config.model_name,
        messages=messages,
    )

    return {"question": question, "answer": response.choices[0].message.content}


async def process_questions(
    context: QuestionProcessingContext, questions: List[str]
) -> List[Dict]:
    """
    Process multiple questions in parallel.

    Args:
        context (QuestionProcessingContext): The context object containing all necessary parameters
        questions (List[str]): A list of questions to process

    Returns:
        List[Dict]: A list of dictionaries containing questions and their answers
    """
    tasks = [get_answer(context, question) for question in questions]
    return await asyncio.gather(*tasks)


async def process_single_question(context: QuestionProcessingContext, prompts):
    """
    Process a single question through the Q&A pipeline.

    Args:
        context (QuestionProcessingContext): Object containing all necessary parameters
            for processing the question
    """
    try:
        # Generate related questions
        task = context.start_animation("Generating related questions")
        related_questions = await generate_related_questions(context, prompts)
        context.stop_animation(task, len("Generating related questions"))

        # Process all questions
        task = context.start_animation("Fetching answers")
        all_questions = [context.question] + related_questions
        results = await process_questions(context, all_questions)
        context.stop_animation(task, len("Fetching answers"))

        # Display and save results
        display_results(results)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        save_results(context.config, context.question, results, timestamp)

    except Exception as e:
        logging.error(f"\nAn error occurred: {str(e)}")
        logging.error("Please try again or enter 'quit' to exit.")


async def pipeline(question: str, expert_type: str, config: ConfigTuple):
    """
    Core processing logic for the Q&A application.

    Args:
        question (str): The user's question
        expert_type (str): The type of expert
        config (ConfigTuple): The configuration object
    """
    client = create_openai_client(config)
    start_animation, stop_animation = create_progress_animation()

    logging.info("Welcome to the Q&A Assistant!")
    logging.info(f"Results will be saved to: {config.output_dir}")

    context = QuestionProcessingContext(
        client=client,
        question=question,
        expert_type=expert_type,
        config=config,
        start_animation=start_animation,
        stop_animation=stop_animation,
        prompts=local_prompts,
    )

    await process_single_question(context, local_prompts)

    print("\nThank you for using the Q&A Assistant!")


async def main(question: str = None, expert_type: str = None, log_to_file: bool = None):
    """
    Main function to run the Q&A application.

    Args:
        question (str, optional): The user's question
        expert_type (str, optional): The type of expert
        log_to_file (bool, optional): Whether to log output to a file
    """
    try:
        if log_to_file is None:
            log_to_file = input("Log to file? (yes/no): ").strip().lower() == "yes"

        config = get_config(log_to_file)

        if question is None:
            question = get_user_question()
        if expert_type is None:
            expert_type = get_expert_type()

        await pipeline(question, expert_type, config)

    except KeyboardInterrupt:
        logging.info("\n\nProgram interrupted by user. Exiting...")
    except Exception as e:
        logging.error(f"\nAn unexpected error occurred: {str(e)}")
    finally:
        logging.info("\nApplication terminated.")


if __name__ == "__main__":
    asyncio.run(main())
