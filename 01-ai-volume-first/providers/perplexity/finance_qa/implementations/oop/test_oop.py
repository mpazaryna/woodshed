"""
Integration test for the Finance Q&A Application.
Tests that the API returns a response without mocks.

Requirements:
    - pytest
    - pytest-asyncio
    - The main application module (assuming it's named v4.py)
"""

import asyncio

import pytest

# Import the necessary functions from your main application
from main import generate_related_questions, process_questions


@pytest.mark.asyncio
async def test_finance_qa_api_response():
    """
    Integration test to verify:
    1. API returns related questions
    2. API provides answers to questions
    """
    # Test data
    test_question = "What is compound interest?"

    # Test related questions generation
    related_questions = await generate_related_questions(test_question)

    # Verify we get related questions
    assert isinstance(related_questions, list), "Should return a list of questions"
    assert len(related_questions) > 0, "Should return at least one related question"

    # Test answer generation
    all_questions = [test_question] + related_questions
    results = await process_questions(all_questions)

    # Verify answers
    assert isinstance(results, list), "Should return a list of results"
    assert len(results) == len(all_questions), "Should have an answer for each question"

    # Verify structure of first result
    first_result = results[0]
    assert "question" in first_result, "Result should contain a question"
    assert "answer" in first_result, "Result should contain an answer"
    assert len(first_result["answer"]) > 0, "Answer should not be empty"


if __name__ == "__main__":
    asyncio.run(pytest.main([__file__]))
