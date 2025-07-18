import os

import pytest

from woodshed.integrations.providers.groq import explore_yoga


@pytest.mark.integration
def test_get_chat_completion_integration(capsys):
    # Call the function
    explore_yoga.get_chat_completion()

    # Check if the output was printed to the console
    captured = capsys.readouterr()
    for model in explore_yoga.MODELS:
        assert f"Model: {model}" in captured.out
        assert len(captured.out) > len(
            f"Model: {model}"
        )  # Ensure some content was printed
