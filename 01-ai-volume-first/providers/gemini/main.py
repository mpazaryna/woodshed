"""
Gemini CLI Module

This module provides a command-line interface for interacting with Google's Gemini AI model.
It includes functionality to configure the Gemini API, initialize the model, and generate
content based on user prompts. The module implements error handling and retry logic to
manage potential API issues.

Key features:
- Configures Gemini API using environment variables
- Initializes Gemini model with specific generation config and safety settings
- Implements a progress indicator for long-running operations
- Provides content generation with exponential backoff retry mechanism
- Logs operations and errors for debugging and monitoring

Usage:
    This module can be run as a script to generate content based on a predefined prompt,
    or its functions can be imported and used in other Python scripts for more
    customized Gemini AI interactions.

Dependencies:
    - google.generativeai
    - os
    - time
    - logging
    - threading
    - sys

Environment Variables:
    GOOGLE_API_KEY: Your Google API key for accessing the Gemini API

"""

import logging
import os
import sys
import threading
import time

import google.generativeai as genai

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("gemini.log"), logging.StreamHandler()],
)


def configure_gemini():
    """
    Configure the Gemini API with the API key from environment variables.

    This function retrieves the Google API key from the GOOGLE_API_KEY environment
    variable and uses it to configure the Gemini API client. It logs a message
    upon successful configuration.

    Raises:
        EnvironmentError: If the GOOGLE_API_KEY environment variable is not set.
    """
    API_KEY = os.environ.get("GOOGLE_API_KEY")
    if not API_KEY:
        raise EnvironmentError("GOOGLE_API_KEY environment variable is not set")
    genai.configure(api_key=API_KEY)
    logging.info("Gemini API configured")


def get_model():
    """
    Initialize and return a configured Gemini AI model.

    This function sets up the generation configuration and safety settings for the
    Gemini model. It then initializes the model with these settings and returns it.

    Returns:
        genai.GenerativeModel: A configured instance of the Gemini AI model.

    Note:
        The model uses specific generation config and safety settings which can be
        adjusted as needed.
    """
    generation_config = {
        "temperature": 0.9,
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 2048,
    }

    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
    ]

    model = genai.GenerativeModel(
        model_name="models/gemini-1.5-pro-latest",
        generation_config=generation_config,
        safety_settings=safety_settings,
    )
    logging.info("Gemini model initialized")
    return model


def progress_indicator():
    """
    Display a simple progress indicator (dots) in the console.

    This function runs in a separate thread and continuously prints dots to the
    console to indicate that a long-running operation is in progress. It can be
    stopped by setting the 'do_run' attribute of the thread to False.
    """
    while getattr(threading.current_thread(), "do_run", True):
        sys.stdout.write(".")
        sys.stdout.flush()
        time.sleep(0.5)


def generate_content(prompt, max_retries=5, initial_delay=1):
    """
    Generate content using the Gemini AI model based on the given prompt.

    This function configures the Gemini API, initializes the model, and attempts
    to generate content. It implements an exponential backoff retry mechanism to
    handle potential API errors.

    Args:
        prompt (str): The input prompt for content generation.
        max_retries (int, optional): Maximum number of retry attempts. Defaults to 5.
        initial_delay (int, optional): Initial delay between retries in seconds. Defaults to 1.

    Returns:
        str or None: The generated content as a string if successful, None otherwise.

    Note:
        This function also manages a progress indicator thread to provide visual
        feedback during content generation.
    """
    configure_gemini()
    model = get_model()

    # Start the progress indicator in a separate thread
    progress_thread = threading.Thread(target=progress_indicator)
    progress_thread.daemon = True
    progress_thread.start()

    result = None
    for attempt in range(max_retries):
        try:
            logging.info(f"Attempting to generate content (attempt {attempt + 1})")
            response = model.generate_content(prompt)
            logging.info("Content generated successfully")
            result = response.text
            break
        except Exception as e:
            delay = initial_delay * (2**attempt)  # Exponential backoff
            logging.warning(
                f"Attempt {attempt + 1} failed: {e}. Retrying in {delay} seconds..."
            )
            if attempt < max_retries - 1:
                time.sleep(delay)
            else:
                logging.error("Max retries reached. Unable to generate content.")

    # Stop the progress indicator
    progress_thread.do_run = False
    progress_thread.join()
    sys.stdout.write("\n")  # Move to the next line after the dots

    return result


if __name__ == "__main__":
    prompt = "What can you tell me about establishing a yoga practice?"
    logging.info(f"Starting content generation with prompt: {prompt}")
    print("Generating content", end="", flush=True)  # Start the line for progress dots
    result = generate_content(prompt)
    if result:
        print("\nContent generated successfully. Output:")
        print(result)
    else:
        print("\nFailed to generate content.")
