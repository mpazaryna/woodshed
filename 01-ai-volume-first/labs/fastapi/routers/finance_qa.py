import logging
import os
import sys
from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

# Add the root directory to the system path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
sys.path.insert(0, root_dir)

from woodshed.modules.perplexity.finance_qa import (
    ensure_output_directory,
    generate_related_questions,
    process_questions,
)


# Server configuration
class ServerConfig:
    def __init__(self):
        self.logger = logging.getLogger("finance_qa")
        self.logger.setLevel(logging.DEBUG)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)


config = ServerConfig()
logger = config.logger

router = APIRouter()


class FinanceQuery(BaseModel):
    question: str


class FinanceResponse(BaseModel):
    original_question: str
    related_questions: List[str]
    answers: List[Dict[str, str]]


async def initialize_finance_service():
    """
    Initialize the finance service and ensure the output directory exists.
    """
    try:
        logger.debug("Initializing Finance Q&A Service")
        ensure_output_directory()
        return True
    except Exception as e:
        logger.exception("Error initializing Finance Q&A Service")
        raise HTTPException(
            status_code=500, detail=f"Error initializing Finance Q&A service: {str(e)}"
        )


@router.post("/finance_qa", response_model=FinanceResponse)
async def get_finance_qa(
    query: FinanceQuery, service=Depends(initialize_finance_service)
):
    """
    Generate finance-related Q&A responses using the Perplexity API.

    This endpoint takes a finance question and:
    1. Generates related questions
    2. Gets answers for all questions (original + related)
    3. Returns the combined results

    Parameters:
    - query (FinanceQuery): An object containing the question field with the user's finance query.

    Returns:
    - FinanceResponse: Object containing original question, related questions, and all answers.

    Raises:
    - HTTPException(500): If there's an error during response generation.

    Example:
    ```
    POST /finance_qa
    {
        "question": "What is compound interest?"
    }
    ```

    Response:
    ```
    {
        "original_question": "What is compound interest?",
        "related_questions": [
            "How is compound interest calculated?",
            "What factors affect compound interest?",
            ...
        ],
        "answers": [
            {
                "question": "What is compound interest?",
                "answer": "Compound interest is..."
            },
            ...
        ]
    }
    ```

    Notes:
    - The function uses the Perplexity API for generating questions and answers
    - Results are automatically saved to files in the configured output directory
    - The function includes error handling and logging for debugging
    """
    logger.debug(f"Received finance query: {query.question}")

    try:
        # Generate related questions
        logger.debug("Generating related questions")
        related_questions = await generate_related_questions(query.question)
        logger.debug(f"Generated {len(related_questions)} related questions")

        # Process all questions
        all_questions = [query.question] + related_questions
        logger.debug(f"Processing {len(all_questions)} total questions")
        answers = await process_questions(all_questions)

        response = FinanceResponse(
            original_question=query.question,
            related_questions=related_questions,
            answers=answers,
        )

        logger.info(
            f"Successfully generated response for query: {query.question[:50]}..."
        )
        logger.debug(f"Full response: {response}")

        return response

    except Exception as e:
        logger.exception(f"Error processing finance query: {query.question[:50]}...")
        raise HTTPException(
            status_code=500, detail=f"Error generating finance Q&A response: {str(e)}"
        )
