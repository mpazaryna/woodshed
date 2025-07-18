import pytest

from woodshed.modules.scrape_wikipedia.main import fetch_wikipedia_pages


@pytest.fixture
def wikipedia_urls():
    return [
        "https://en.wikipedia.org/wiki/Python_(programming_language)",
        "https://en.wikipedia.org/wiki/Asynchronous_I/O",
    ]


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
            assert "Python" in content, f"'Python' not in content for {url}"
        elif "Asynchronous" in url:
            assert "Asynchronous" in content, f"'Asynchronous' not in content for {url}"


@pytest.mark.asyncio
async def test_fetch_and_validate_wikipedia_pages_in_memory(wikipedia_urls):
    # Fetch the content
    fetched_content = await fetch_wikipedia_pages(wikipedia_urls)

    # Simulate saving content in memory
    in_memory_storage = {
        "tmp": [content for _, content in fetched_content],
        "persistent": [content for _, content in fetched_content],
    }

    # Validate in-memory content
    for content_list in in_memory_storage.values():
        combined_content = " ".join(content_list)
        assert "Python" in combined_content, "'Python' not in in-memory content"
        assert (
            "programming language" in combined_content.lower()
        ), "'programming language' not in in-memory content"
        assert (
            "asynchronous" in combined_content.lower()
        ), "'asynchronous' not in in-memory content"


@pytest.mark.asyncio
async def test_save_wikipedia_pages_in_memory(wikipedia_urls):
    # Fetch the content
    fetched_content = await fetch_wikipedia_pages(wikipedia_urls)

    # Simulate saving content in memory
    in_memory_storage = {
        "tmp": [content for _, content in fetched_content],
        "persistent": [content for _, content in fetched_content],
    }

    # Validate in-memory content
    for content_list in in_memory_storage.values():
        combined_content = " ".join(content_list)
        assert (
            "Python" in combined_content or "Asynchronous" in combined_content
        ), "Expected content not in in-memory content"
