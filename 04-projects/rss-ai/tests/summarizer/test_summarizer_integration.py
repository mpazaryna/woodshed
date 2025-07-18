import os
import unittest

from rss_kit.summarizer import generate_summary, summarize_article


def test_summarize_article():
    article_url = "http://example.com/article1"

    # Read the article content from the file
    with open("data/mock/article.md", "r") as file:
        article_text = file.read()

    # Call the summarize_article function
    summary = summarize_article(article_url, article_text)

    # Assert that the summary is not empty
    assert len(summary) > 0, "The summary should not be empty."
