import logging
from typing import Dict, List


def get_user_question() -> str:
    """Prompt the user to enter a question and validate the input."""
    while True:
        print("\nEnter your question below:")
        question = input("Your question: ").strip()
        if question:
            return question
        print("Please enter a valid question.")


def get_expert_type() -> str:
    """Prompt the user to enter the expert type and validate the input."""
    while True:
        expert_type = input("Enter the expert type (e.g., financial expert): ").strip()
        if expert_type:
            return expert_type
        print("Please enter a valid expert type.")


def get_user_choice() -> bool:
    """Prompt user to continue or exit."""
    while True:
        choice = (
            input("\nWould you like to ask another question? (yes/no): ")
            .lower()
            .strip()
        )
        if choice in ["yes", "y"]:
            return True
        elif choice in ["no", "n"]:
            return False
        print("Please enter 'yes' or 'no'")


def display_results(results: List[Dict]):
    """
    Display Q&A results in a formatted way.

    Args:
        results (List[Dict]): The list of results containing questions and answers.
    """
    logging.info("\nResults:")
    logging.info("=" * 80)
    for i, result in enumerate(results, 1):
        logging.info(f"\nQuestion {i}: {result['question']}")
        logging.info("-" * 40)
        logging.info(f"Answer: {result['answer']}")
        logging.info("=" * 80)
