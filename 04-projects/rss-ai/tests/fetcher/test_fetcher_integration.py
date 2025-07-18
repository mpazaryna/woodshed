"""
Integration test module for rss_fetcher.py

This module contains integration tests for the rss_fetcher module.
It uses pytest for testing and includes real calls to external dependencies.

Test coverage aims for integration tests of the rss_fetcher module.
"""

import logging
import os

import pytest

from rss_kit.error_handler import FeedFetchError
from rss_kit.fetcher import fetch_rss, get_recent_articles

# Set up logging for tests
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Path to the test feeds file
TEST_FEEDS_PATH = "/Users/mpaz/workspace/rss-ai/data/test_feeds.yaml"  # Updated path


# Add this line for debugging
logger.info(f"TEST_FEEDS_PATH: {TEST_FEEDS_PATH}")


# Tests for fetch_rss function
def test_fetch_rss_success():
    # Test with multiple URLs in case one is temporarily unavailable
    test_urls = [
        "https://openai.com/blog/rss.xml",
        "https://news.ycombinator.com/rss",
        "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    ]

    for url in test_urls:
        try:
            result = fetch_rss(url)
            assert isinstance(result, list)
            assert len(result) > 0
            assert all(isinstance(item, dict) for item in result)
            assert all("title" in item and "link" in item for item in result)
            break  # If successful, exit the loop
        except FeedFetchError as e:
            print(f"Failed to fetch {url}: {str(e)}")
    else:
        pytest.fail("All test URLs failed")


# Integration test for get_recent_articles function
def test_get_recent_articles():
    result = get_recent_articles(TEST_FEEDS_PATH, days=7)
    assert isinstance(result, list)
    assert len(result) > 0
    assert all(isinstance(article, dict) for article in result)
    assert all("title" in article and "link" in article for article in result)


# Error handling test for get_recent_articles
def test_get_recent_articles_error_handling():
    non_existent_file = "non_existent_file.yaml"
    logger.info(
        f"Running test_get_recent_articles_error_handling with path: {non_existent_file}"
    )
    result = get_recent_articles(non_existent_file, days=7)
    logger.info(f"Get recent articles error handling result: {result}")
    assert isinstance(result, list), f"Expected list, got {type(result)}"
    assert len(result) == 0, f"Expected empty list, got {result}"
