import logging
import os
import sys

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

# Add the root directory to the system path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
sys.path.insert(0, root_dir)

from woodshed.modules.langchain.langchain_service import (
    get_langchain_service,  # type: ignore
)


# Server configuration
class ServerConfig:
    def __init__(self):
        self.logger = logging.getLogger("response_generation")
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


class Query(BaseModel):
    text: str


async def get_langchain_service_dependency():
    try:
        logger.debug("Attempting to initialize LangChainService")
        service = await get_langchain_service()
        logger.debug(
            f"LangChainService initialized successfully. Using LLM: {service.config['llm']['default']}"
        )
        return service
    except Exception as e:
        logger.exception("Error initializing LangChainService")
        logger.error(f"Error details: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error initializing LLM service: {str(e)}"
        )


@router.post("/generate_response")
async def generate_response(
    query: Query, service=Depends(get_langchain_service_dependency)
):
    """
    Generate a response using an AI language model.

    This endpoint takes a text query and uses a language model to generate a response.
    The response is based on the prompt: "You are a helpful assistant. Respond to the following: {input}"

    Parameters:
    - query (Query): An object containing the text field with the user's input query.

    Returns:
    - dict: A dictionary containing the 'response' key with the generated text.

    Raises:
    - HTTPException(500): If there's an error during response generation.

    Example:
    ```
    POST /generate_response
    {
        "text": "What is the capital of France?"
    }
    ```

    Response:
    ```
    {
        "response": "The capital of France is Paris. Paris is not only the political capital but also the cultural and economic center of France. It's known for its iconic landmarks such as the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral."
    }
    ```

    Notes:
    - The function uses a LangChain service to generate responses.
    - The specific language model used is configured in the service and logged for debugging purposes.
    - The function includes error handling and logging for better debugging and monitoring.
    """
    prompt = "You are a helpful assistant. Respond to the following: {input}"
    logger.debug(f"Received query: {query.text[:50]}...")
    logger.debug(f"Using LLM: {service.config['llm']['default']}")

    try:
        logger.debug("Calling service.generate_response")
        response = await service.generate_response(prompt, query.text)
        logger.info(f"Generated response for query: {query.text[:50]}...")
        logger.debug(f"Full response: {response}")
        return {"response": response}
    except Exception as e:
        logger.exception(f"Error generating response for query: {query.text[:50]}...")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
