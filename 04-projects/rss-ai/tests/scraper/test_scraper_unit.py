from unittest.mock import Mock, patch

import pytest
import requests

from rss_kit.error_handler import FeedFetchError
from rss_kit.scraper import scrape_url


@pytest.fixture
def mock_requests_get():
    with patch("rss_kit.scraper.requests.get") as mock_get:
        yield mock_get


def test_scrape_url_success(mock_requests_get):
    mock_response = Mock()
    mock_response.content = (
        "<html><body><h1>Test</h1><p>Content</p><div>More</div></body></html>"
    )
    mock_requests_get.return_value = mock_response

    result = scrape_url("https://example.com")
    assert result.split() == ["Test", "Content", "More"]


def test_scrape_url_network_error(mock_requests_get):
    mock_requests_get.side_effect = requests.exceptions.RequestException(
        "Network error"
    )

    with pytest.raises(FeedFetchError, match="Error fetching URL https://example.com"):
        scrape_url("https://example.com")


def test_scrape_url_invalid_url():
    with pytest.raises(FeedFetchError, match="Invalid URL format: invalid_url"):
        scrape_url("invalid_url")


def test_scrape_url_empty_content(mock_requests_get):
    mock_response = Mock()
    mock_response.content = "<html><body></body></html>"
    mock_requests_get.return_value = mock_response

    result = scrape_url("https://example.com")
    assert result.strip() == ""
