"""
Error Handling Test Module for rss_fetcher.py

This module contains unit tests specifically for error handling in the rss_fetcher module.
It uses pytest for testing and avoids using mocks, instead relying on real scenarios
that can trigger errors.

Test coverage focuses on error handling paths in the rss_fetcher module.
"""

import os
from datetime import datetime, timedelta

import pytest
import pytz

from rss_kit.error_handler import FeedFetchError, ParseError
from rss_kit.fetcher import (
    fetch_rss,
    filter_recent_articles,
    get_recent_articles,
    load_feeds,
)

# Path to the test directory
TEST_DIR = os.path.dirname(os.path.abspath(__file__))


def test_load_feeds_file_not_found():
    non_existent_file = os.path.join(TEST_DIR, "non_existent_file.yaml")
    with pytest.raises(ParseError, match="Feed file not found:"):
        load_feeds(non_existent_file)


def test_load_feeds_invalid_yaml():
    invalid_yaml_file = os.path.join(TEST_DIR, "invalid_yaml.yaml")
    with open(invalid_yaml_file, "w") as f:
        f.write("invalid: yaml: content:")

    with pytest.raises(ParseError, match="Error parsing YAML file"):
        load_feeds(invalid_yaml_file)

    # Clean up the temporary file
    os.remove(invalid_yaml_file)


def test_fetch_rss_invalid_url():
    with pytest.raises(FeedFetchError, match="Error fetching RSS feed from"):
        fetch_rss("http://invalid.url.that.does.not.exist")


def test_filter_recent_articles_invalid_date():
    invalid_articles = [
        {
            "title": "Test Article",
            "link": "http://example.com",
            "published_parsed": "invalid_date",
        }
    ]
    result = filter_recent_articles(invalid_articles, 7)
    assert result == [], "Expected an empty list for invalid date"


def test_get_recent_articles_partial_failure():
    test_feeds_file = os.path.join(TEST_DIR, "test_feeds_with_error.yaml")
    with open(test_feeds_file, "w") as f:
        f.write(
            """
        Valid Feed: https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml
        Invalid Feed: http://invalid.url.that.does.not.exist
        """
        )

    result = get_recent_articles(test_feeds_file, 7)

    assert len(result) > 0, "Expected at least one valid article"
    assert all(
        isinstance(article, dict) for article in result
    ), "All items should be dictionaries"
    assert all(
        "title" in article and "link" in article for article in result
    ), "All articles should have title and link"

    # Clean up the temporary file
    os.remove(test_feeds_file)


def test_get_recent_articles_all_feeds_fail():
    test_feeds_file = os.path.join(TEST_DIR, "all_invalid_feeds.yaml")
    with open(test_feeds_file, "w") as f:
        f.write(
            """
        Invalid Feed 1: http://invalid1.url.that.does.not.exist
        Invalid Feed 2: http://invalid2.url.that.does.not.exist
        """
        )

    result = get_recent_articles(test_feeds_file, 7)

    assert result == [], "Expected an empty list when all feeds fail"

    # Clean up the temporary file
    os.remove(test_feeds_file)


def test_filter_recent_articles_mixed_validity():
    now = datetime.now(pytz.utc)
    valid_recent = now - timedelta(days=1)
    valid_old = now - timedelta(days=10)

    mixed_articles = [
        {
            "title": "Invalid Article",
            "link": "http://example.com/invalid",
            "published_parsed": "invalid_date",
        },
        {
            "title": "Recent Article",
            "link": "http://example.com/recent",
            "published_parsed": valid_recent.timetuple(),
        },
        {
            "title": "Old Article",
            "link": "http://example.com/old",
            "published_parsed": valid_old.timetuple(),
        },
    ]
    result = filter_recent_articles(mixed_articles, 7)
    assert len(result) == 1, "Expected one recent article"
    assert (
        result[0]["title"] == "Recent Article"
    ), "Expected the recent article to be returned"
