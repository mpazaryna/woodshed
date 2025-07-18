"""
RSS Fetcher Module

This module provides functionality to fetch and process RSS feeds.
It includes functions to read feed URLs from a YAML file, fetch RSS content,
and filter articles based on recency.

Functions:
    load_feeds(file_path: str) -> dict
    fetch_rss(url: str) -> List[Dict]
    filter_recent_articles(articles: List[Dict], days: int) -> List[Dict]
    get_recent_articles(file_path: str, days: int) -> List[Dict]

Dependencies:
    - PyYAML
    - feedparser
    - pytz
    - datetime
"""

import os
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from typing import Dict, List

import feedparser
import pytz
import requests
import yaml

from rss_kit.error_handler import (
    FeedFetchError,
    FilterError,
    ParseError,
    RSSAIError,
    handle_error,
)
from rss_kit.logger import setup_logger

# Setup logger
logger = setup_logger("rss_fetcher", "rss_fetcher.log")


def load_feeds(file_path: str) -> dict:
    """
    Load RSS feed URLs from a YAML file.

    Args:
        file_path (str): Path to the YAML file containing RSS feed URLs.

    Returns:
        dict: A dictionary of feed names and their corresponding URLs.

    Raises:
        FileNotFoundError: If the specified file is not found.
        yaml.YAMLError: If there's an error parsing the YAML file.
    """
    try:
        logger.info(f"Attempting to load feeds from: {file_path}")
        logger.info(f"Current working directory: {os.getcwd()}")
        logger.info(f"File exists: {os.path.exists(file_path)}")

        with open(file_path, "r") as file:
            file_content = file.read()
            logger.info(f"File content: {file_content}")
            data = yaml.safe_load(file_content)

        logger.info(f"YAML data loaded: {data}")

        if not isinstance(data, dict):
            logger.warning(f"Loaded data is not a dictionary. Type: {type(data)}")
            return {}

        # If there's a 'feeds' key, use that; otherwise, use the whole dict
        feeds = data.get("feeds", data)

        logger.info(f"Successfully loaded {len(feeds)} feeds from {file_path}")
        return feeds
    except FileNotFoundError as e:
        handle_error(e, ParseError, f"Feed file not found: {file_path}")
    except yaml.YAMLError as e:
        handle_error(e, ParseError, "Error parsing YAML file")
    except Exception as e:
        handle_error(e, RSSAIError, "Unexpected error loading feeds")


def fetch_rss(url: str) -> List[Dict]:
    """
    Fetch and parse an RSS feed.

    Args:
        url (str): URL of the RSS feed.

    Returns:
        List[Dict]: A list of dictionaries, each containing article metadata.

    Raises:
        Exception: If there's an error fetching or parsing the RSS feed.
    """
    try:
        # Use feedparser to fetch and parse the RSS feed directly
        feed_data = feedparser.parse(url)

        if feed_data.bozo:
            logger.error(f"Feedparser encountered an error: {feed_data.bozo_exception}")

            # Attempt to parse the raw XML to get more information
            try:
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                ET.fromstring(response.content)
            except ET.ParseError as xml_error:
                logger.error(f"XML parsing error: {xml_error}")
            except requests.RequestException as req_error:
                logger.error(f"Request error: {req_error}")

            raise ValueError(f"Error parsing feed: {feed_data.bozo_exception}")

        # Extract articles from the feed
        articles = []
        for entry in feed_data.entries:
            # Log entry details
            logger.info(f"Entry Title: {entry.title}")
            logger.info(f"Entry Link: {entry.link}")
            logger.info(f"Entry Published Date: {entry.published}")

            # Safely access the summary attribute
            summary = getattr(entry, "summary", "No summary available")

            logger.info(f"Entry Summary: {summary}")

            articles.append(
                {
                    "title": entry.title,
                    "link": entry.link,
                    "published_parsed": entry.published_parsed,
                    "summary": summary,  # Include summary safely
                }
            )
        return articles

    except Exception as e:
        logger.exception(f"Error fetching RSS feed from {url}")
        handle_error(e, FeedFetchError, f"Error fetching RSS feed from {url}")


def filter_recent_articles(articles: List[Dict], days: int) -> List[Dict]:
    """
    Filter articles based on recency.

    Args:
        articles (List[Dict]): List of article dictionaries.
        days (int): Number of days to look back.

    Returns:
        List[Dict]: Filtered list of recent articles.

    Raises:
        FilterError: If there's an error filtering the articles.
    """
    try:
        cutoff_date = datetime.now(pytz.utc) - timedelta(days=days)
        recent_articles = []
        for article in articles:
            if "published_parsed" in article:
                try:
                    published_date = datetime(
                        *article["published_parsed"][:6], tzinfo=pytz.utc
                    )
                    if published_date > cutoff_date:
                        recent_articles.append(article)
                except (TypeError, ValueError):
                    logger.warning(
                        f"Invalid date format for article: {article.get('title', 'Unknown')}"
                    )
                    continue

        logger.info(
            f"Filtered {len(recent_articles)} recent articles out of {len(articles)} total articles"
        )
        return recent_articles
    except Exception as e:
        handle_error(e, FilterError, "Error filtering recent articles")


def get_recent_articles(file_path: str, days: int) -> List[Dict]:
    """
    Get recent articles from all feeds specified in the YAML file.

    Args:
        file_path (str): Path to the YAML file containing RSS feed URLs.
        days (int): Number of days to look back for recent articles.

    Returns:
        List[Dict]: A list of recent articles from all feeds.
    """
    try:
        feeds = load_feeds(file_path)
    except ParseError:
        logger.error(f"Failed to load feeds from {file_path}")
        return []

    all_articles = []

    for name, url in feeds.items():
        try:
            logger.info(f"Processing feed: {name}")
            articles = fetch_rss(url)
            recent_articles = filter_recent_articles(articles, days)
            for article in recent_articles:
                article["feed_name"] = name
            all_articles.extend(recent_articles)
        except Exception as e:
            logger.error(f"Error processing feed '{name}': {str(e)}")
            # Continue processing other feeds

    logger.info(
        f"Retrieved a total of {len(all_articles)} recent articles from all feeds"
    )
    return all_articles
