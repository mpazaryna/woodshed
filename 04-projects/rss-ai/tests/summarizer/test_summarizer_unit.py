import os
import shutil
import tempfile

from rss_kit.error_handler import RSSAIError
from rss_kit.summarizer import (
    CACHE_DIR,
    cache_summary,
    generate_cache_filename,
    generate_summary,
    get_cached_summary,
    summarize_article,
)


# Existing test
def test_generate_cache_filename():
    article_url = "http://example.com/articles/new_feature.html"
    expected_filename = "example_com_new_feature"
    generated_filename = generate_cache_filename(article_url)
    assert generated_filename == expected_filename
