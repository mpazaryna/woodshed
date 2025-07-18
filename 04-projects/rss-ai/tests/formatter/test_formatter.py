import os

import pytest

from rss_kit.formatter import format_summary


def test_format_summary():
    article_data = {
        "title": "Test Article",
        "source": "Test Source",
        "date": "2023-04-14",
        "url": "https://example.com/article",
    }
    summary = "This is a test summary."

    expected_output = """# Test Article

**Source**: Test Source
**Date**: 2023-04-14

This is a test summary.

[Read more](https://example.com/article)
"""

    assert format_summary(article_data, summary) == expected_output


def test_format_summary_missing_data():
    article_data = {"title": "Test Article"}
    summary = "This is a test summary of the article."

    expected_output = """# Test Article

**Source**: Unknown source
**Date**: No date available

This is a test summary of the article.

[Read more](#)
"""

    assert format_summary(article_data, summary) == expected_output


def test_format_summary_file_output():
    article_data = {
        "title": "Example.com Article 2",
        "source": "Example.com",
        "date": "2023-04-15",
        "url": "https://example.com/article2",
    }
    summary = "This is a summary of the second example article from Example.com."

    formatted_output = format_summary(article_data, summary)

    output_dir = "data/output"
    output_file = "example_com_article2.md"
    output_path = os.path.join(output_dir, output_file)

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Write the formatted output to the file
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(formatted_output)

    # Read the file contents and compare with the formatted output
    with open(output_path, "r", encoding="utf-8") as f:
        file_contents = f.read()

    assert file_contents == formatted_output
