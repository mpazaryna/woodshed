import asyncio
import os
import sys
from pathlib import Path
from typing import List, Tuple

import aiohttp


class Config:
    def __init__(self):
        self.data_dir = Path("/Users/mpaz/workspace/woodshed-ai/data/output")
        self.output_file = self.data_dir / "chunked_files.json"


async def fetch_wikipedia_pages(urls: List[str]) -> List[Tuple[str, str]]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_page(session, url) for url in urls]
        return await asyncio.gather(*tasks)


async def fetch_page(session: aiohttp.ClientSession, url: str) -> Tuple[str, str]:
    async with session.get(url) as response:
        content = await response.text()
        return url, content


def save_wikipedia_pages(
    contents: List[str], filename: str, persistent: bool = False
) -> None:
    output_dir = config.data_dir
    file_path = output_dir / filename

    with open(file_path, "w", encoding="utf-8") as f:
        for content in contents:
            f.write(content)
            f.write("\n" + "-" * 80 + "\n")  # Separator between pages


if __name__ == "__main__":
    urls = [
        "https://en.wikipedia.org/wiki/Python_(programming_language)",
        "https://en.wikipedia.org/wiki/Asynchronous_I/O",
    ]

    # Initialize the config without parameters
    config = Config()

    fetched_content = asyncio.run(fetch_wikipedia_pages(urls))

    save_wikipedia_pages(
        [content for _, content in fetched_content],
        "wikipedia_pages.txt",
        persistent=True,
    )
    print(f"Wikipedia pages saved to {config.data_dir / 'wikipedia_pages.txt'}")
