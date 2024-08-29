from unittest.mock import MagicMock, patch

import groq
import pytest
from groq_kit.utils import get_chat_completion


def test_chat_completion():
    question = "What is yoga?"
    models = ["llama3-8b-8192"]  # Choose a model from the available ones

    # Call the get_chat_completion function
    completions = get_chat_completion(models, question)

    # Store the result in results.txt
    with open("data/results.txt", "w") as f:
        for model, content in completions.items():
            f.write(f"{model}: {content}\n")

    assert completions  # Ensure we received a response
