from pathlib import Path

import pytest

from recipe_assistant.utils import read_file_from_data_directory


@pytest.fixture
def data_directory():
    # Get the actual path to the data directory
    current_dir = Path(__file__).parent
    data_dir = current_dir.parent / "data"
    return data_dir


def test_read_existing_json_file(data_directory):
    result = read_file_from_data_directory("test.json")
    assert isinstance(result, dict)
    assert "rss_feeds" in result
    assert isinstance(result["rss_feeds"], list)
    assert len(result["rss_feeds"]) > 0
    assert "name" in result["rss_feeds"][0]
    assert "url" in result["rss_feeds"][0]
