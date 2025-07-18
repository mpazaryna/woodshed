"""
Test module for rss_fetcher.py

This module contains unit and integration tests for the rss_fetcher module.
It uses pytest for testing and includes real calls to external dependencies.

Test coverage aims for 100% of the rss_fetcher module.
"""

import logging
import os
from datetime import datetime, timedelta
from unittest.mock import patch

import pytest
import pytz

from rss_kit.error_handler import FeedFetchError
from rss_kit.fetcher import (
    fetch_rss,
    filter_recent_articles,
    get_recent_articles,
    load_feeds,
)

# Set up logging for tests
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Path to the test feeds file
TEST_FEEDS_PATH = "/Users/mpaz/workspace/rss-ai/data/test_feeds.yaml"  # Updated path

# Add this line for debugging
logger.info(f"TEST_FEEDS_PATH: {TEST_FEEDS_PATH}")


# Tests for load_feeds function
def test_load_feeds_success():
    logger.info(f"Running test_load_feeds_success with path: {TEST_FEEDS_PATH}")
    result = load_feeds(TEST_FEEDS_PATH)
    logger.info(f"Load feeds result: {result}")
    assert isinstance(result, dict), f"Expected dict, got {type(result)}"
    assert len(result) > 0, f"Expected non-empty dict, got {result}"
    assert all(
        isinstance(key, str) and isinstance(value, str) for key, value in result.items()
    ), f"Expected all string key-value pairs, got {result}"
    assert "OpenAI" in result, f"Expected 'OpenAI' key, got keys: {result.keys()}"
    assert (
        "HuggingFace" in result
    ), f"Expected 'HuggingFace' key, got keys: {result.keys()}"


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


# Tests for filter_recent_articles function
def test_filter_recent_articles():
    now = datetime.now(pytz.utc)
    articles = [
        {"published_parsed": now.timetuple()},
        {"published_parsed": (now - timedelta(days=2)).timetuple()},
        {"published_parsed": (now - timedelta(days=5)).timetuple()},
    ]
    result = filter_recent_articles(articles, 3)
    assert len(result) == 2


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
