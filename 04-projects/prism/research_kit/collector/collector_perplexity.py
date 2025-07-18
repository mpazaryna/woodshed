import json
import os

import requests
from requests.exceptions import RequestException, Timeout
from tenacity import retry, stop_after_attempt, wait_exponential

from research_kit.utils.error_handling import handle_request_error, handle_timeout_error
from research_kit.utils.logging import setup_logger

# Set up the logger
logger = setup_logger("collector_perplexity", "logs/collector_perplexity.log")


def create_payload(query, company_domain):
    """
    Creates the payload for the Perplexity API request.

    Args:
        query (str): The query to send to the Perplexity API.
        company_domain (str): The domain of the company to filter results.

    Returns:
        str: A JSON string representing the payload.
    """
    return json.dumps(
        {
            "model": "llama-3.1-sonar-huge-128k-online",
            "messages": [
                {
                    "role": "system",
                    "content": "Be precise. Return as much information as possible.",
                },
                {"role": "user", "content": f"{query}"},
            ],
            "max_tokens": "2000",
            "temperature": 0.2,
            "top_p": 0.9,
            "return_citations": True,
            "search_domain_filter": ["perplexity.ai", f"{company_domain}"],
            "return_images": False,
            "return_related_questions": True,
            "search_recency_filter": "month",
            "top_k": 0,
            "stream": False,
            "presence_penalty": 0,
            "frequency_penalty": 1,
        }
    )


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def get_perplexity_response(query, company_domain, timeout=30):
    """
    Sends a query to the Perplexity API and returns the response content.

    This function manages API requests to Perplexity, including error handling and retries.
    It uses the error handling utilities from utils/error_handling.py to manage different
    types of errors that may occur during the API request and response parsing.

    Error Handling:
    1. API Key: Checks if the API key is set in environment variables.
    2. Network Errors: Handled by the @retry decorator, which attempts the request up to 3 times
       with exponential backoff between attempts.
    3. Timeout Errors: Caught and handled by handle_timeout_error, which logs the error and raises a TimeoutError.
    4. Request Exceptions: Caught and handled by handle_request_error, which logs the error, checks for
       specific status codes (like 524), and raises appropriate exceptions.
    5. Parsing Errors: Caught and logged, then a ValueError is raised with details about the parsing failure.

    Args:
        query (str): The query to send to the Perplexity API.
        company_domain (str): The domain of the company to filter results.
        timeout (int): The timeout for the API request in seconds. Defaults to 30.

    Returns:
        str: The content of the Perplexity API response.

    Raises:
        ValueError: If the API key is not set or if there's an error parsing the response.
        TimeoutError: If the request times out.
        RequestException: For other request-related errors.
    """
    api_key = os.environ.get("PERPLEXITY_API_KEY")

    if not api_key:
        logger.error("API key is not set in the environment variables.")
        raise ValueError(
            "API key is required but not set in the environment variables."
        )

    url = "https://api.perplexity.ai/chat/completions"

    payload = create_payload(query, company_domain)
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(url, headers=headers, data=payload, timeout=timeout)
        response.raise_for_status()
        response_json = response.json()

        content = response_json["choices"][0]["message"]["content"]
        logger.info(f"Perplexity response for query '{query}': {content}")

        return content

    except Timeout as e:
        handle_timeout_error(e, "Perplexity API", timeout, logger)

    except RequestException as e:
        handle_request_error(e, "Perplexity API", response, logger)

    except (KeyError, IndexError, json.JSONDecodeError) as e:
        logger.error(f"Error parsing Perplexity API response: {str(e)}")
        logger.error(
            f"Response content: {response.text if 'response' in locals() else 'No response'}"
        )
        raise ValueError(f"Error parsing Perplexity API response: {str(e)}")


if __name__ == "__main__":
    api_key = os.environ.get("PERPLEXITY_API_KEY")
    query = "What do you know about Mount Vernon Mills?"
    company_domain = "mvmills.com"
    try:
        result = get_perplexity_response(query, company_domain)
        print(result)
    except (TimeoutError, RequestException, ValueError) as e:
        print(f"Error: {str(e)}")
