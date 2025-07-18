"""
This module contains functions for processing RSS feeds and extracting recipe information.
It follows functional programming principles and uses a composition-based approach.
"""

import json
import logging
from typing import Any, Dict, List

import feedparser

from recipe_assistant.logger_config import setup_logger
from recipe_assistant.utils import read_file_from_data_directory

logger = setup_logger(__name__, logging.INFO, "app.log")


def load_feed_list(filename: str = "rss_feeds.json") -> List[Dict[str, str]]:
    """
    Load the RSS feed list from a JSON file in the data directory.

    Args:
        filename (str): The name of the JSON file containing RSS feed information.
                        Defaults to "rss_feeds.json".

    Returns:
        List[Dict[str, str]]: A list of dictionaries, each containing 'name' and 'url' keys.

    Raises:
        FileNotFoundError: If the specified file does not exist.
        json.JSONDecodeError: If the file contains invalid JSON.
    """
    data = read_file_from_data_directory(filename)
    rss_feeds = data.get("rss_feeds", [])
    logger.info(f"Loaded {len(rss_feeds)} RSS feeds from {filename}")
    return rss_feeds


# Additional functions can be added here as needed, following the same functional programming principles
"""
This module contains functions for processing RSS feeds and extracting recipe information.
It follows functional programming principles and uses a composition-based approach.
"""

# ... existing code ...


def read_feed_object(rss_data: Dict[str, str]) -> Dict[str, Any]:
    """
    Fetch and parse content for a single RSS feed.

    Args:
        rss_data (Dict[str, str]): A dictionary containing 'name' and 'url' keys for the RSS feed.

    Returns:
        Dict[str, Any]: A feed object containing parsed content.

    Raises:
        ValueError: If the RSS feed URL is invalid or unreachable.
    """
    try:
        feed = feedparser.parse(rss_data["url"])
        if feed.bozo == 0:
            logging.info(f"Successfully fetched and parsed RSS feed: {rss_data['name']}")
            feed_object = {
                "name": rss_data["name"],
                "url": rss_data["url"],
                "title": feed.feed.title,
                "description": feed.feed.get("description", ""),
                "entries": [
                    {
                        "title": entry.get("title", ""),
                        "link": entry.get("link", ""),
                        "published": entry.get("published", ""),
                        "summary": entry.get("summary", ""),
                    }
                    for entry in feed.entries
                ],
            }

            # Temporary logging of the feed object
            logger.info(f"Feed object for {rss_data['name']}:\n{json.dumps(feed_object, indent=2)}")

            return feed_object
        else:
            logger.error(f"Error parsing RSS feed {rss_data['name']}: Feed is not well-formed")
            raise ValueError(f"Error parsing RSS feed {rss_data['name']}: Feed is not well-formed")
    except Exception as e:
        logger.error(f"Error processing RSS feed {rss_data['name']}: {str(e)}")
        raise ValueError(f"Error processing RSS feed: {str(e)}")


# Additional functions can be added here as needed, following the same functional programming principles
