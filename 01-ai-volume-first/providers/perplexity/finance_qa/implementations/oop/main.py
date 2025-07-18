"""
Finance Q&A Application

This module provides a command-line interface for users to ask finance-related questions.
It uses the Perplexity API to generate and answer related questions in parallel, providing
comprehensive insights into the user's financial query. Results are saved in both JSON
and Markdown formats in a designated output directory.

Required Environment Variables:
    PERPLEXITY_API_KEY: API key for accessing the Perplexity API

Dependencies:
    - openai
    - python-dotenv
    - asyncio
    - aiohttp
"""

import asyncio
import json
import os
import sys
import threading
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

# Define output directory
OUTPUT_DIR = Path("data/output/perplexity_finance")


class ProgressIndicator:
    """
    A class to handle the progress animation in the console.
    """

    def __init__(self, message: str):
        self.message = message
        self.is_running = False
        self.thread = None

    def _animate(self):
        """
        Animation function that runs in a separate thread.
        """
        dots = 1
        while self.is_running:
            sys.stdout.write(f"\r{self.message}" + "." * dots + " " * (3 - dots))
            sys.stdout.flush()
            dots = (dots % 3) + 1
            time.sleep(0.5)

    def start(self):
        """
        Start the progress animation.
        """
        self.is_running = True
        self.thread = threading.Thread(target=self._animate)
        self.thread.start()

    def stop(self):
        """
        Stop the progress animation and clear the line.
        """
        self.is_running = False
        if self.thread:
            self.thread.join()
        sys.stdout.write("\r" + " " * (len(self.message) + 4) + "\r")
        sys.stdout.flush()


def ensure_output_directory():
    """
    Create the output directory structure if it doesn't exist.
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


async def generate_related_questions(question: str) -> List[str]:
    """
    Generate related finance questions based on the user's input question.

    Args:
        question (str): The original finance question from the user

    Returns:
        List[str]: A list of up to 5 related questions
    """
    messages = [
        {
            "role": "system",
            "content": (
                "You are a financial expert assistant. Generate up to 5 related "
                "questions that would provide additional context and understanding "
                "to the user's primary question. Return only the questions as a "
                "numbered list, no other text."
            ),
        },
        {
            "role": "user",
            "content": question,
        },
    ]

    client = OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")
    response = client.chat.completions.create(
        model="llama-3.1-sonar-large-128k-online",
        messages=messages,
    )

    # Parse the numbered list response into separate questions
    questions = [
        q.strip()
        for q in response.choices[0].message.content.split("\n")
        if q.strip() and any(q.strip().startswith(str(i)) for i in range(1, 6))
    ]

    return questions


async def get_answer(client: OpenAI, question: str) -> Dict:
    """
    Get an answer for a specific question using the Perplexity API.

    Args:
        client (OpenAI): The OpenAI client instance
        question (str): The question to be answered

    Returns:
        Dict: A dictionary containing the question and its answer
    """
    messages = [
        {
            "role": "system",
            "content": (
                "You are a financial expert. Provide a clear, concise, and accurate "
                "answer to the following finance-related question."
            ),
        },
        {
            "role": "user",
            "content": question,
        },
    ]

    response = client.chat.completions.create(
        model="llama-3.1-sonar-large-128k-online",
        messages=messages,
    )

    return {"question": question, "answer": response.choices[0].message.content}


async def process_questions(questions: List[str]) -> List[Dict]:
    """
    Process multiple questions in parallel using the Perplexity API.

    Args:
        questions (List[str]): List of questions to be processed

    Returns:
        List[Dict]: List of dictionaries containing questions and their answers
    """
    client = OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")
    tasks = [get_answer(client, question) for question in questions]
    results = await asyncio.gather(*tasks)
    return results


def generate_filenames(timestamp: str) -> Tuple[Path, Path]:
    """
    Generate filenames for JSON and Markdown outputs.

    Args:
        timestamp (str): Timestamp string for the filename

    Returns:
        Tuple[Path, Path]: JSON and Markdown file paths
    """
    base_name = f"finance_qa_{timestamp}"
    return (OUTPUT_DIR / f"{base_name}.json", OUTPUT_DIR / f"{base_name}.md")


def save_results(original_question: str, results: List[Dict]):
    """
    Save the Q&A results to both JSON and Markdown files.

    Args:
        original_question (str): The user's original question
        results (List[Dict]): List of dictionaries containing Q&A pairs
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    json_path, md_path = generate_filenames(timestamp)

    # Save JSON
    output = {
        "original_question": original_question,
        "timestamp": timestamp,
        "results": results,
    }

    with open(json_path, "w") as f:
        json.dump(output, f, indent=2)

    # Save Markdown
    with open(md_path, "w") as f:
        f.write(f"# Finance Q&A Results\n\n")
        f.write(f"*Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
        f.write(f"## Original Question\n\n{original_question}\n\n")
        f.write("## Detailed Analysis\n\n")

        for i, result in enumerate(results, 1):
            f.write(f"### Question {i}\n\n")
            f.write(f"**Q:** {result['question']}\n\n")
            f.write(f"**A:** {result['answer']}\n\n")
            if i < len(results):
                f.write("---\n\n")

    print(f"\nResults saved to:")
    print(f"- JSON: {json_path}")
    print(f"- Markdown: {md_path}")


def display_results(results: List[Dict]):
    """
    Display the Q&A results in a formatted way.

    Args:
        results (List[Dict]): List of dictionaries containing Q&A pairs
    """
    print("\nResults:")
    print("=" * 80)
    for i, result in enumerate(results, 1):
        print(f"\nQuestion {i}: {result['question']}")
        print("-" * 40)
        print(f"Answer: {result['answer']}")
        print("=" * 80)


def get_user_choice() -> bool:
    """
    Prompt the user to continue or exit.

    Returns:
        bool: True if user wants to continue, False if user wants to exit
    """
    while True:
        choice = (
            input("\nWould you like to ask another question? (yes/no): ")
            .lower()
            .strip()
        )
        if choice in ["yes", "y"]:
            return True
        if choice in ["no", "n"]:
            return False
        print("Please enter 'yes' or 'no'")


async def process_single_question(question: str):
    """
    Process a single question through the Q&A pipeline.

    Args:
        question (str): The user's question
    """
    try:
        # Generate related questions with progress indicator
        progress = ProgressIndicator("Generating related questions")
        progress.start()
        related_questions = await generate_related_questions(question)
        progress.stop()

        # Process questions with progress indicator
        progress = ProgressIndicator("Fetching answers")
        progress.start()
        all_questions = [question] + related_questions
        results = await process_questions(all_questions)
        progress.stop()

        display_results(results)
        save_results(question, results)

    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        print("Please try again or enter 'quit' to exit.")


async def main():
    """
    Main function to run the Finance Q&A application.
    """
    try:
        # Ensure output directory exists
        ensure_output_directory()

        print("Welcome to the Finance Q&A Assistant!")
        print(f"Results will be saved to: {OUTPUT_DIR}")

        while True:
            print("\nEnter your finance-related question below:")
            question = input("Your question: ").strip()

            if not question:
                print("Please enter a valid question.")
                continue

            await process_single_question(question)

            if not get_user_choice():
                print("\nThank you for using the Finance Q&A Assistant!")
                break

    except KeyboardInterrupt:
        print("\n\nProgram interrupted by user. Exiting...")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {str(e)}")
    finally:
        print("\nApplication terminated.")
        exit(0)


if __name__ == "__main__":
    asyncio.run(main())
