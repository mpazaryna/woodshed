"""
Finance Q&A Application (Functional Version)

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
import time
from datetime import datetime
from pathlib import Path
from typing import Callable, Dict, List, Tuple

from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

# Define output directory
OUTPUT_DIR = Path("data/output/perplexity_finance")


def create_progress_animation() -> Tuple[Callable, Callable]:
    """
    Creates progress animation functions.

    Returns:
        Tuple[Callable, Callable]: (start_animation, stop_animation) functions
    """
    animation_running = False

    def animate(message: str):
        nonlocal animation_running
        dots = 1
        while animation_running:
            sys.stdout.write(f"\r{message}" + "." * dots + " " * (3 - dots))
            sys.stdout.flush()
            dots = (dots % 3) + 1
            time.sleep(0.5)

    def start_animation(message: str) -> asyncio.Task:
        nonlocal animation_running
        animation_running = True
        return asyncio.create_task(asyncio.to_thread(animate, message))

    def stop_animation(task: asyncio.Task, message_length: int):
        nonlocal animation_running
        animation_running = False
        task.cancel()
        sys.stdout.write("\r" + " " * (message_length + 4) + "\r")
        sys.stdout.flush()

    return start_animation, stop_animation


def ensure_output_directory(directory: Path):
    """Create the output directory structure if it doesn't exist."""
    directory.mkdir(parents=True, exist_ok=True)


async def generate_related_questions(client: OpenAI, question: str) -> List[str]:
    """Generate related finance questions based on the user's input question."""
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
        {"role": "user", "content": question},
    ]

    response = client.chat.completions.create(
        model="llama-3.1-sonar-large-128k-online",
        messages=messages,
    )

    return [
        q.strip()
        for q in response.choices[0].message.content.split("\n")
        if q.strip() and any(q.strip().startswith(str(i)) for i in range(1, 6))
    ]


async def get_answer(client: OpenAI, question: str) -> Dict:
    """Get an answer for a specific question using the Perplexity API."""
    messages = [
        {
            "role": "system",
            "content": (
                "You are a financial expert. Provide a clear, concise, and accurate "
                "answer to the following finance-related question."
            ),
        },
        {"role": "user", "content": question},
    ]

    response = client.chat.completions.create(
        model="llama-3.1-sonar-large-128k-online",
        messages=messages,
    )

    return {"question": question, "answer": response.choices[0].message.content}


async def process_questions(client: OpenAI, questions: List[str]) -> List[Dict]:
    """Process multiple questions in parallel using the Perplexity API."""
    tasks = [get_answer(client, question) for question in questions]
    return await asyncio.gather(*tasks)


def generate_filenames(directory: Path, timestamp: str) -> Tuple[Path, Path]:
    """Generate filenames for JSON and Markdown outputs."""
    base_name = f"finance_qa_{timestamp}"
    return (directory / f"{base_name}.json", directory / f"{base_name}.md")


def save_results(
    directory: Path, original_question: str, results: List[Dict], timestamp: str
):
    """Save the Q&A results to both JSON and Markdown files."""
    json_path, md_path = generate_filenames(directory, timestamp)

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
    """Display the Q&A results in a formatted way."""
    print("\nResults:")
    print("=" * 80)
    for i, result in enumerate(results, 1):
        print(f"\nQuestion {i}: {result['question']}")
        print("-" * 40)
        print(f"Answer: {result['answer']}")
        print("=" * 80)


def get_user_choice() -> bool:
    """Prompt the user to continue or exit."""
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


async def process_single_question(
    client: OpenAI,
    question: str,
    start_animation: Callable,
    stop_animation: Callable,
):
    """Process a single question through the Q&A pipeline."""
    try:
        # Generate related questions with progress indicator
        task = start_animation("Generating related questions")
        related_questions = await generate_related_questions(client, question)
        stop_animation(task, len("Generating related questions"))

        # Process questions with progress indicator
        task = start_animation("Fetching answers")
        all_questions = [question] + related_questions
        results = await process_questions(client, all_questions)
        stop_animation(task, len("Fetching answers"))

        display_results(results)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        save_results(OUTPUT_DIR, question, results, timestamp)

    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        print("Please try again or enter 'quit' to exit.")


async def main():
    """Main function to run the Finance Q&A application."""
    try:
        # Ensure output directory exists
        ensure_output_directory(OUTPUT_DIR)

        # Create OpenAI client
        client = OpenAI(
            api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai"
        )

        # Create progress animation functions
        start_animation, stop_animation = create_progress_animation()

        print("Welcome to the Finance Q&A Assistant!")
        print(f"Results will be saved to: {OUTPUT_DIR}")

        while True:
            print("\nEnter your finance-related question below:")
            question = input("Your question: ").strip()

            if not question:
                print("Please enter a valid question.")
                continue

            await process_single_question(
                client, question, start_animation, stop_animation
            )

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
