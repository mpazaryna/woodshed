# prompt_utils.py

from functools import partial
from pathlib import Path
from typing import Callable, Dict, Optional

import yaml


def load_expert_prompts(filepath: str = "expert_prompts.yaml") -> Dict[str, str]:
    """
    Load expert prompts from a YAML file.

    Args:
        filepath (str): Path to the YAML file containing expert prompts

    Returns:
        Dict[str, str]: Dictionary of expert prompts

    Raises:
        FileNotFoundError: If the YAML file doesn't exist
        yaml.YAMLError: If the YAML file is invalid
    """
    try:
        with open(filepath, "r") as file:
            return yaml.safe_load(file) or {}
    except FileNotFoundError:
        # If file doesn't exist, create it with default prompts
        default_prompts = {
            "financial advisor": (
                "As a financial advisor, generate 2 related questions that would help provide "
                "a more complete picture of the user's financial situation or needs. Consider "
                "aspects like risk tolerance, time horizon, tax implications, and broader "
                "financial goals. Return only the questions as a numbered list."
            ),
            "tax expert": (
                "As a tax expert, generate 2 related questions that would help clarify the tax "
                "implications, compliance requirements, or potential deductions related to the "
                "user's question. Consider both current and future tax years. Return only the "
                "questions as a numbered list."
            ),
            "investment analyst": (
                "As an investment analyst, generate 2 related questions that would help evaluate "
                "the investment opportunity, market conditions, or portfolio considerations. "
                "Consider factors like market trends, risk assessment, and diversification. "
                "Return only the questions as a numbered list."
            ),
            "business consultant": (
                "As a business consultant, generate 2 related questions that would help understand "
                "the broader business context, operational implications, or strategic considerations. "
                "Consider factors like market position, resources, and growth potential. Return "
                "only the questions as a numbered list."
            ),
        }

        # Ensure directory exists
        Path(filepath).parent.mkdir(parents=True, exist_ok=True)

        # Save default prompts to file
        with open(filepath, "w") as file:
            yaml.safe_dump(default_prompts, file, sort_keys=False)

        return default_prompts


def create_default_prompt(expert_type: str) -> str:
    """Create a default prompt for unknown expert types."""
    return (
        f"As a {expert_type}, generate 2 related questions that would provide additional "
        "context and deeper understanding to the user's primary question. Focus on your "
        "area of expertise. Return only the questions as a numbered list."
    )


def get_prompt(expert_type: str, prompts: Dict[str, str] = None) -> str:
    """
    Get the expert-specific prompt for question generation.

    Args:
        expert_type (str): The type of expert to get the prompt for
        prompts (Dict[str, str], optional): Dictionary of expert prompts to use

    Returns:
        str: The expert-specific prompt or a default prompt if not found
    """
    if prompts is None:
        prompts = load_expert_prompts()
    return prompts.get(expert_type.lower(), create_default_prompt(expert_type))


def create_prompt_store(initial_prompts: Dict[str, str] = None) -> Dict[str, Callable]:
    """
    Create a store of prompt-related functions with a shared prompt dictionary.

    Args:
        initial_prompts (Dict[str, str], optional): Initial prompts dictionary

    Returns:
        Dict[str, Callable]: Dictionary of prompt management functions
    """
    prompts = initial_prompts if initial_prompts is not None else load_expert_prompts()

    def add_prompt(expert_type: str, prompt: str) -> Dict[str, str]:
        """Add or update an expert prompt."""
        prompts[expert_type.lower()] = prompt
        # Save updated prompts to YAML file
        with open("expert_prompts.yaml", "w") as file:
            yaml.safe_dump(prompts, file, sort_keys=False)
        return prompts

    def remove_prompt(expert_type: str) -> Dict[str, str]:
        """Remove an expert prompt."""
        prompts.pop(expert_type.lower(), None)
        # Save updated prompts to YAML file
        with open("expert_prompts.yaml", "w") as file:
            yaml.safe_dump(prompts, file, sort_keys=False)
        return prompts

    def get_all_expert_types() -> list[str]:
        """Get list of all available expert types."""
        return list(prompts.keys())

    # Partial application for get_prompt with current prompts
    get_prompt_with_store = partial(get_prompt, prompts=prompts)

    return {
        "get_prompt": get_prompt_with_store,
        "add_prompt": add_prompt,
        "remove_prompt": remove_prompt,
        "get_all_expert_types": get_all_expert_types,
        "get_prompts": lambda: prompts.copy(),  # Return copy to prevent mutation
    }
