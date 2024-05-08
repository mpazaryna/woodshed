import pytest
import os
from examples.explore_groq import get_chat_completion

def test_get_chat_completion():
    # Run the function
    get_chat_completion()

    # Check that the file is not empty
    assert os.path.getsize("completions/llama3-8b-8192.txt") > 0

    # Check that the file is not empty
    assert os.path.getsize("completions/llama3-70b-8192.txt") > 0

    # Check that the file is not empty
    assert os.path.getsize("completions/mixtral-8x7b-32768.txt") > 0

    # Check that the file is not empty
    assert os.path.getsize("completions/gemma-7b-it.txt") > 0
