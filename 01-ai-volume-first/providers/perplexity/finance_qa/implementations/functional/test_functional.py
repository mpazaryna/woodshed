"""
Integration test for the Functional Finance Q&A Application.
Tests the API responses and functional components without mocks.

Requirements:
    - pytest
    - pytest-asyncio
    - openai
    - python-dotenv
"""

import asyncio
import os
from pathlib import Path

import pytest
from dotenv import load_dotenv

# Update this import path to match your project structure
from main import (
    create_progress_animation,
    ensure_output_directory,
    generate_filenames,
    generate_related_questions,
    process_questions,
    save_results,
)
from openai import OpenAI

# Load environment variables for testing
load_dotenv()
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")


@pytest.fixture
def client():
    """Fixture to provide OpenAI client."""
    return OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")


@pytest.fixture
def test_output_dir(tmp_path):
    """Fixture to provide a temporary directory for test outputs."""
    test_dir = tmp_path / "test_output"
    test_dir.mkdir()
    return test_dir


@pytest.mark.asyncio
async def test_finance_qa_api_response(client):
    """
    Integration test to verify:
    1. API returns related questions
    2. API provides answers to questions
    """
    # Test data
    test_question = "What is compound interest?"

    # Test related questions generation
    related_questions = await generate_related_questions(client, test_question)

    # Verify we get related questions
    assert isinstance(related_questions, list), "Should return a list of questions"
    assert len(related_questions) > 0, "Should return at least one related question"

    # Test answer generation
    all_questions = [test_question] + related_questions
    results = await process_questions(client, all_questions)

    # Verify answers
    assert isinstance(results, list), "Should return a list of results"
    assert len(results) == len(all_questions), "Should have an answer for each question"

    # Verify structure of first result
    first_result = results[0]
    assert "question" in first_result, "Result should contain a question"
    assert "answer" in first_result, "Result should contain an answer"
    assert len(first_result["answer"]) > 0, "Answer should not be empty"


def test_progress_animation():
    """Test progress animation function creation."""
    start_animation, stop_animation = create_progress_animation()

    assert callable(start_animation), "start_animation should be callable"
    assert callable(stop_animation), "stop_animation should be callable"


def test_ensure_output_directory(tmp_path):
    """Test directory creation function."""
    test_dir = tmp_path / "test_qa_output"
    ensure_output_directory(test_dir)
    assert test_dir.exists(), "Directory should be created"
    assert test_dir.is_dir(), "Should create a directory"


def test_generate_filenames(test_output_dir):
    """Test filename generation function."""
    timestamp = "20240101_120000"
    json_path, md_path = generate_filenames(test_output_dir, timestamp)

    assert json_path.suffix == ".json", "Should generate JSON file path"
    assert md_path.suffix == ".md", "Should generate Markdown file path"
    assert json_path.parent == test_output_dir, "Should use provided directory"
    assert md_path.parent == test_output_dir, "Should use provided directory"


def test_save_results(test_output_dir):
    """Test results saving function."""
    # Test data
    original_question = "What is compound interest?"
    results = [
        {
            "question": "What is compound interest?",
            "answer": "Compound interest is interest earned on both...",
        }
    ]
    timestamp = "20240101_120000"

    # Save results
    save_results(test_output_dir, original_question, results, timestamp)

    # Check if files were created
    json_path, md_path = generate_filenames(test_output_dir, timestamp)
    assert json_path.exists(), "JSON file should be created"
    assert md_path.exists(), "Markdown file should be created"

    # Verify JSON content
    with open(json_path) as f:
        json_content = f.read()
        assert original_question in json_content
        assert results[0]["answer"] in json_content

    # Verify Markdown content
    with open(md_path) as f:
        md_content = f.read()
        assert "# Finance Q&A Results" in md_content
        assert original_question in md_content
        assert results[0]["answer"] in md_content


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


if __name__ == "__main__":
    pytest.main([__file__])
