"""
Unit test module for rss_fetcher.py

This module contains unit tests for the rss_fetcher module.
It uses pytest for testing and does not include calls to external dependencies.

Test coverage aims for unit tests of the rss_fetcher module.
"""

import logging
import os
from datetime import datetime, timedelta

import pytest
import pytz

from rss_kit.fetcher import filter_recent_articles, load_feeds

# Set up logging for tests
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Path to the test feeds file
TEST_FEEDS_PATH = "/Users/mpaz/workspace/rss-ai/data/test_feeds.yaml"  # Updated path


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
