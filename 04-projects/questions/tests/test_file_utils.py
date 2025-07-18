import json
import os
from datetime import datetime

import pytest

from questions.config import ConfigTuple
from questions.file_utils import save_results


@pytest.fixture
def setup_output_dir(tmp_path):
    """Fixture to set up the output directory."""
    # Provide all required arguments for ConfigTuple
    config = ConfigTuple(
        output_dir=tmp_path,
        perplexity_api_key="your_api_key",  # Replace with a valid key or a mock
        log_file="path/to/log_file.log",  # Replace with a valid log file path or a mock
        log_to_file=True,  # Set to True or False as needed
        model_name="your_model_name",  # Replace with a valid model name
        base_url="http://your.base.url",  # Replace with a valid base URL
    )
    return config


def test_save_results(setup_output_dir):
    """Test the save_results function."""
    config = setup_output_dir
    original_question = "What is the capital of France?"
    results = [
        {"question": "What is the capital of France?", "answer": "Paris"},
        {"question": "What is the largest city in France?", "answer": "Paris"},
    ]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    save_results(config, original_question, results, timestamp)

    # Check JSON file
    json_file = config.output_dir / f"questions_{timestamp}.json"
    assert json_file.is_file()
    with open(json_file) as f:
        data = json.load(f)
        assert data["original_question"] == original_question
        assert data["results"] == results

    # Check Markdown file
    md_file = config.output_dir / f"questions_{timestamp}.md"
    assert md_file.is_file()
    with open(md_file) as f:
        content = f.read()
        assert original_question in content
        assert "## Detailed Analysis" in content
        assert "### Question 1" in content
        assert "### Question 2" in content

    # Clean up
    os.remove(json_file)
    os.remove(md_file)
