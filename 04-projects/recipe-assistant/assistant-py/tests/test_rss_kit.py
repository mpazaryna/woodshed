"""
This module contains pytest-based unit tests for the rss_functions module.
"""

import json

import pytest

from recipe_assistant.rss_kit import load_feed_list
from recipe_assistant.utils import read_file_from_data_directory


def test_load_feed_list():
    """
    Test the load_feed_list function with the existing rss_feeds.json file.
    """
    result = load_feed_list()
    assert isinstance(result, list)
    assert len(result) > 0
    for feed in result:
        assert "name" in feed
        assert "url" in feed


def test_load_feed_list_custom_filename():
    """
    Test the load_feed_list function with a custom filename.
    """
    result = load_feed_list("rss_feeds.json")
    assert isinstance(result, list)
    assert len(result) > 0
    for feed in result:
        assert "name" in feed
        assert "url" in feed


def test_load_feed_list_file_not_found():
    """
    Test the load_feed_list function when file is not found.
    """
    with pytest.raises(FileNotFoundError):
        load_feed_list("non_existent.json")


def test_load_feed_list_invalid_json():
    """
    Test the load_feed_list function with invalid JSON.
    """
    # Assuming there's an invalid JSON file named "invalid.json" in the data directory
    with pytest.raises(json.JSONDecodeError):
        load_feed_list("invalid.json")


def test_read_file_from_data_directory():
    """
    Test the read_file_from_data_directory function directly.
    """
    result = read_file_from_data_directory("rss_feeds.json")
    assert isinstance(result, dict)
    assert "rss_feeds" in result
    assert isinstance(result["rss_feeds"], list)
