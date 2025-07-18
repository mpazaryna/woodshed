import time

import pytest

from rss_kit.scraper import scrape_url


def test_scrape_real_website():
    url = "https://huggingface.co/blog/deploy-hugging-face-models-easily-with-amazon-sagemaker"
    content = scrape_url(url)
    assert "Deploy Hugging Face models easily with Amazon SageMaker" in content
    assert "Hugging Face" in content
    assert "Amazon SageMaker" in content
    assert len(content) > 500  # Ensure we're getting a substantial amount of content


def test_scrape_nonexistent_website():
    with pytest.raises(Exception):
        scrape_url("https://thiswebsitedoesnotexist12345.com")


def test_rate_limiting():
    start_time = time.time()
    scrape_url(
        "https://huggingface.co/blog/deploy-hugging-face-models-easily-with-amazon-sagemaker"
    )
    scrape_url(
        "https://huggingface.co/blog/deploy-hugging-face-models-easily-with-amazon-sagemaker"
    )
    end_time = time.time()

    assert (
        end_time - start_time >= 1
    ), "Rate limiting should enforce a delay between requests"
