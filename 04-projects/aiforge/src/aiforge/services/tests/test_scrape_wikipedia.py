import os

import pytest

from aiforge.config import config
from aiforge.services.scrape_wikipedia import (fetch_wikipedia_pages,
                                               save_wikipedia_pages)


@pytest.fixture
def wikipedia_urls():
    return [
        "https://en.wikipedia.org/wiki/Python_(programming_language)",
        "https://en.wikipedia.org/wiki/Asynchronous_I/O",
    ]


@pytest.fixture
def output_files():
    return {
        "tmp": config.tmp_dir / "test_scrape.txt",
        "persistent": config.data_dir / "test_scrape.txt",
    }


@pytest.fixture(autouse=True)
def cleanup(output_files):
    yield
    if os.environ.get("KEEP_TEST_FILES", "").lower() != "true":
        for file_path in output_files.values():
            if file_path.exists():
                file_path.unlink()
    else:
        print("\nTest files were not deleted. You can find them at:")
        for key, file_path in output_files.items():
            if file_path.exists():
                print(f"- {key}: {file_path}")


@pytest.mark.asyncio
async def test_fetch_wikipedia_pages(wikipedia_urls):
    # Fetch the content
    fetched_content = await fetch_wikipedia_pages(wikipedia_urls)

    # Validate fetched content
    assert len(fetched_content) == len(wikipedia_urls), "Not all URLs were fetched"
    for url, content in fetched_content:
        assert url in wikipedia_urls, f"Unexpected URL: {url}"
        assert content, "Empty content fetched"
        if "Python" in url:
            assert "Python" in content, f"'Python' notin content for {url}"
        elif "Asynchronous" in url:
            assert "Asynchronous" in content, f"'Asynchronous' not in content for {url}"


@pytest.mark.asyncio
async def test_fetch_save_and_validate_wikipedia_pages(wikipedia_urls, output_files):
    # Fetch the content
    fetched_content = await fetch_wikipedia_pages(wikipedia_urls)

    # Save the content
    save_wikipedia_pages(
        [content for _, content in fetched_content],
        output_files["tmp"].name,
        persistent=False,
    )
    save_wikipedia_pages(
        [content for _, content in fetched_content],
        output_files["persistent"].name,
        persistent=True,
    )

    # Validate saved content
    for file_path in output_files.values():
        assert file_path.exists(), f"File not found at {file_path}"

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Check for expected content
        assert "Python" in content, f"'Python' not in {file_path}"
        assert (
            "programming language" in content.lower()
        ), f"'programming language' not in {file_path}"
        assert "asynchronous" in content.lower(), f"'asynchronous' not in {file_path}"


@pytest.mark.asyncio
async def test_save_wikipedia_pages(wikipedia_urls, output_files):
    # Fetch the content
    fetched_content = await fetch_wikipedia_pages(wikipedia_urls)

    # Test saving to temporary file
    save_wikipedia_pages(
        [content for _, content in fetched_content],
        output_files["tmp"].name,
        persistent=False,
    )
    assert output_files[
        "tmp"
    ].exists(), f"Temporary file not created: {output_files['tmp']}"

    # Test saving to persistent file
    save_wikipedia_pages(
        [content for _, content in fetched_content],
        output_files["persistent"].name,
        persistent=True,
    )
    assert output_files[
        "persistent"
    ].exists(), f"Persistent file not created: {output_files['persistent']}"

    # Validate file contents
    for file_path in output_files.values():
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        assert (
            "Python" in content or "Asynchronous" in content
        ), f"Expected content not in {file_path}"
