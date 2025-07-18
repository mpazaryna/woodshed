# woodshed/modules/questions/router.py
import logging
import os
import sys
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

# Add the root directory to the system path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
sys.path.insert(0, root_dir)

from woodshed.modules.questions.main import (
    QuestionProcessingContext,
    create_openai_client,
    generate_related_questions,
    get_config,
    process_questions,
)

# Configure logging
logger = logging.getLogger("questions_service")
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

# Create router
router = APIRouter(
    prefix="/questions",
    tags=["questions"],
    responses={404: {"description": "Not found"}},
)


class QuestionRequest(BaseModel):
    question: str = Field(..., description="The question to be answered")
    expert_type: str = Field(..., description="Type of expert to answer the question")
    log_to_file: bool = Field(
        default=False, description="Whether to log output to file"
    )


class Answer(BaseModel):
    question: str
    answer: str


class QuestionResponse(BaseModel):
    original_question: str
    expert_type: str
    timestamp: str
    answers: List[Answer]


# Dummy animation functions for API context
def dummy_start_animation(_):
    return None


def dummy_stop_animation(_, __):
    pass


async def get_question_service_dependency():
    try:
        logger.debug("Initializing Question Service")
        config = get_config(log_to_file=False)
        client = create_openai_client(config)
        logger.debug("Question Service initialized successfully")
        return (client, config)
    except Exception as e:
        logger.exception("Error initializing Question Service")
        logger.error(f"Error details: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error initializing Question Service: {str(e)}"
        )


@router.post("/process", response_model=QuestionResponse)
async def process_question(
    request: QuestionRequest, service=Depends(get_question_service_dependency)
):
    """
    Process a question using the Q&A pipeline.
    """
    client, config = service
    logger.debug(f"Received question: {request.question[:50]}...")

    try:
        # Create processing context
        context = QuestionProcessingContext(
            client=client,
            question=request.question,
            expert_type=request.expert_type,
            config=config,
            start_animation=dummy_start_animation,
            stop_animation=dummy_stop_animation,
        )

        # Process questions
        results = []
        related_questions = await generate_related_questions(context)
        all_questions = [request.question] + related_questions
        results = await process_questions(context, all_questions)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        response = QuestionResponse(
            original_question=request.question,
            expert_type=request.expert_type,
            timestamp=timestamp,
            answers=[
                Answer(question=result["question"], answer=result["answer"])
                for result in results
            ],
        )

        logger.info(f"Successfully processed question: {request.question[:50]}...")
        return response

    except Exception as e:
        logger.exception(f"Error processing question: {request.question[:50]}...")
        raise HTTPException(
            status_code=500, detail=f"Error processing question: {str(e)}"
        )
