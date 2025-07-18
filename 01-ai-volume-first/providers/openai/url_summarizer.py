"""
This script provides functionality to summarize web pages using the OpenAI GPT model
and the Langchain summarization framework. It fetches content from a given URL and 
returns a summarized version of that content.

Note:
- The OPENAI_API_KEY for all Woodshed-AI projects should be set in the environment.
- The USER_AGENT environment variable is also required to identify requests.
"""

import os
import sys
from typing import Optional

# Set the USER_AGENT environment variable
os.environ["USER_AGENT"] = "YourUserAgentString"

from langchain_community.document_loaders import WebBaseLoader
from langchain_openai import ChatOpenAI
from openai import OpenAIError
from requests.exceptions import RequestException

from langchain.chains.summarize import load_summarize_chain


def run_call_summarize(url: str) -> Optional[str]:
    """
    Given a URL, this function fetches its content, summarizes it using a chain based on the GPT model,
    and returns the summarized version.

    Args:
        url (str): The URL of the web page/document to be summarized.

    Returns:
        Optional[str]: Summarized content of the provided URL, or None if an error occurs.
    """
    try:
        # Create an instance of the WebBaseLoader with the provided URL.
        loader = WebBaseLoader(url)

        # Load the document/content from the provided URL.
        docs = loader.load()

        # Instantiate the ChatOpenAI model.
        llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo-16k")

        # Load the summarization chain.
        chain = load_summarize_chain(llm, chain_type="stuff")

        # Run the summarization chain on the loaded documents and return the summarized result.
        response = chain.invoke(docs)

        # Extract only the summary from the response
        summary = response["output_text"]

        return summary

    except RequestException as e:
        print(f"Error fetching the URL: {e}", file=sys.stderr)
    except OpenAIError as e:
        print(f"OpenAI API error: {e}", file=sys.stderr)
    except ValueError as e:
        print(f"Error in processing the content: {e}", file=sys.stderr)
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)

    return None


if __name__ == "__main__":
    """
    Main execution block for the script. It defines a URL to summarize and prints the summary.
    """
    url_to_summarize = "https://austinkleon.com/2010/01/31/logbook/"

    try:
        summary = run_call_summarize(url_to_summarize)
        if summary:
            print(summary)
        else:
            print("Failed to generate summary.", file=sys.stderr)
    except Exception as e:
        print(f"An error occurred in the main execution: {e}", file=sys.stderr)
        sys.exit(1)
