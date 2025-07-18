import logging
import time
from typing import Optional
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

from rss_kit.error_handler import FeedFetchError, RSSAIError, handle_error

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Constants
DEFAULT_USER_AGENT = "RSS-AI-Scraper/1.0"
RATE_LIMIT_DELAY = 1  # seconds


def scrape_url(url: str, user_agent: Optional[str] = None) -> str:
    """
    Scrape the content of a given URL using BeautifulSoup to strip HTML tags.

    Args:
        url (str): The URL to scrape.
        user_agent (Optional[str]): Custom user agent string. If None, uses default.

    Returns:
        str: The cleaned text content of the webpage.

    Raises:
        FeedFetchError: If there's an error fetching the URL or if the URL is invalid.
        RSSAIError: For other unexpected errors.
    """
    # Validate URL
    parsed_url = urlparse(url)
    if not parsed_url.scheme or not parsed_url.netloc:
        handle_error(
            ValueError("Invalid URL"), FeedFetchError, f"Invalid URL format: {url}"
        )

    headers = {
        "User-Agent": user_agent or DEFAULT_USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://openai.com/",
    }

    try:
        # Implement basic rate limiting
        time.sleep(RATE_LIMIT_DELAY)

        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        handle_error(e, FeedFetchError, f"Error fetching URL {url}")

    try:
        soup = BeautifulSoup(response.content, "html.parser")

        # Remove script and style elements
        for script_or_style in soup(["script", "style"]):
            script_or_style.decompose()

        # Get text content
        text = soup.get_text(separator="\n")

        # Break into lines and remove leading and trailing space on each
        lines = (line.strip() for line in text.splitlines())

        # Drop blank lines
        text = "\n".join(line for line in lines if line)

        logger.info(f"Successfully scraped content from {url}")
        return text
    except Exception as e:
        handle_error(e, RSSAIError, f"Error processing content from {url}")
