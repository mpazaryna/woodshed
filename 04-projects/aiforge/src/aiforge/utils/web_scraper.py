"""
Asynchronous Wikipedia Scraper

This module implements an asynchronous scraper for fetching content from multiple Wikipedia pages
simultaneously. It demonstrates the use of asynchronous programming in Python to efficiently
retrieve data from web pages concurrently.

Key Features:
- Asynchronous HTTP requests using aiohttp
- Concurrent execution of multiple requests
- File I/O operations for saving scraped content

The script uses Python's asyncio library for managing asynchronous operations. It leverages
the aiohttp library for making non-blocking HTTP requests, which allows for efficient
handling of multiple requests concurrently.

Asynchronous Programming Concepts Used:
1. Coroutines (async/await): Used to define asynchronous functions.
2. AsyncIO Event Loop: Manages the execution of coroutines.
3. Asynchronous Context Managers: Used with aiohttp.ClientSession for efficient connection management.
4. Task Gathering: asyncio.gather() is used to run multiple coroutines concurrently and wait for all of them to complete.

For more information on asynchronous programming in Python, refer to:
- AsyncIO documentation: https://docs.python.org/3/library/asyncio.html
- aiohttp documentation: https://docs.aiohttp.org/en/stable/

For an in-depth understanding of web scraping ethics and best practices, see:
- Python Documentation on Web Scraping: https://docs.python.org/3/howto/urllib2.html
- Web Scraping Best Practices: https://www.scrapehero.com/how-to-prevent-getting-blacklisted-while-scraping/

Usage:
    Run this script directly to fetch and save content from predefined Wikipedia pages.
    python -m src.paz.lab.async_scraper

    Or import and use the functions in other scripts for custom scraping tasks.
"""

# src/aiforge/utils/web_scraper.py

import asyncio
from pathlib import Path
from typing import List, Tuple

import aiohttp

from aiforge.config import config  # Import the config object


async def fetch_wikipedia_pages(urls: List[str]) -> List[Tuple[str, str]]:
    async def fetch_url(session: aiohttp.ClientSession, url: str) -> Tuple[str, str]:
        async with session.get(url) as response:
            html_content = await response.text()
            return url, html_content

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)

    return results


def save_wikipedia_pages(
    content: List[Tuple[str, str]],
    output_filename: str,
    persistent: bool = False,
) -> Path:
    output_dir = config.data_dir if persistent else config.tmp_dir
    output_file_path = output_dir / output_filename

    with open(output_file_path, "w", encoding="utf-8") as f:
        for url, html_content in content:
            f.write(f"Content from {url}: \n{html_content}\n\n")

    print(f"Content saved to {output_file_path}")
    return output_file_path


# You can add more web scraping utility functions here as needed
