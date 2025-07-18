# tests/test_analysis.py

import os
import sys
from unittest.mock import mock_open, patch

import pytest

# Add the src directory to the Python path
sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src"))
)

from delta_8_analysis.analysis import (
    analyze_sentiment,
    calculate_and_save_sentiment,
    compare_keywords,
    extract_keywords,
    generate_themes,
    generate_wordcloud,
    load_data,
    preprocess_text,
    summarize_differences,
)

# Mock data for testing
mock_tweets = [
    {"date": "2021-09-01", "tweet": "Delta 8 is amazing for sleep and anxiety"},
    {"date": "2021-09-02", "tweet": "Just tried Delta 8 gummies, very relaxing"},
    {"date": "2021-09-03", "tweet": "Is Delta 8 legal? Need to check regulations"},
]


@pytest.fixture
def mock_csv_data():
    return "\n".join(
        [
            "date,tweet",
            "2021-09-01,Delta 8 is amazing for sleep and anxiety",
            "2021-09-02,Just tried Delta 8 gummies, very relaxing",
            "2021-09-03,Is Delta 8 legal? Need to check regulations",
        ]
    )


def test_load_data(mock_csv_data):
    with patch("builtins.open", mock_open(read_data=mock_csv_data)):
        data = load_data("fake_file.csv")
    assert len(data) == 3
    assert data[0]["tweet"] == "Delta 8 is amazing for sleep and anxiety"


def test_preprocess_text():
    text = "Delta 8 is amazing for sleep and anxiety!"
    processed = preprocess_text(text)
    assert "delta" in processed
    assert "sleep" in processed
    assert "anxiety" in processed
    assert "!" not in processed


def test_extract_keywords():
    keywords = extract_keywords(mock_tweets)
    assert isinstance(keywords, list)
    assert len(keywords) > 0
    assert isinstance(keywords[0], tuple)


def test_compare_keywords():
    pre_keywords = [("delta", 3), ("sleep", 2), ("anxiety", 2)]
    post_keywords = [("delta", 3), ("legal", 2), ("gummies", 2)]
    common, pre_only, post_only = compare_keywords(pre_keywords, post_keywords)
    assert "delta" in common
    assert "sleep" in pre_only
    assert "legal" in post_only


def test_generate_themes():
    keywords = [
        ("delta", 3),
        ("sleep", 2),
        ("anxiety", 2),
        ("legal", 1),
        ("gummies", 1),
    ]
    themes = generate_themes(keywords)
    assert "Cannabis Types and Components" in themes
    assert "User Experience" in themes
    assert "Legality and Regulation" in themes


def test_analyze_sentiment():
    text = "Delta 8 is amazing for sleep and anxiety"
    sentiment = analyze_sentiment(text)
    assert isinstance(sentiment, dict)
    assert all(
        key in sentiment for key in ["positive", "negative", "neutral", "compound"]
    )
    assert all(isinstance(score, float) for score in sentiment.values())
    assert all(
        0 <= score <= 1
        for score in sentiment.values()
        if score != sentiment["compound"]
    )
    assert -1 <= sentiment["compound"] <= 1


if __name__ == "__main__":
    pytest.main()
