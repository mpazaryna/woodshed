# Implement Web Scrape Module using BeautifulSoup

## Objective

Create a Python module that extracts the content of a given URL using BeautifulSoup to strip HTML tags.

## Description

We need to implement a web scraping module for our RSS and AI application. This module should take a URL as input, fetch the web page content, and return the cleaned text content without HTML tags.

## Requirements

1. Create a new Python file named `web_scraper.py`.
1. Implement a function `scrape_url(url: str) -> str` that:
   - Takes a URL as input
   - Fetches the web page content
   - Uses BeautifulSoup to parse the HTML
   - Removes all HTML tags and scripts
   - Returns the cleaned text content
1. Handle common exceptions such as network errors or invalid URLs.
1. Implement basic rate limiting to avoid overloading servers.
1. Add appropriate logging for debugging purposes.
1. Create a new Pytest file named 'test_web_scraper_unit.py' for unit tests
1. Create a new Pytest file named 'test_web_scraper_integration.py' for integration tests.

## Technical Specifications

- Use the `requests` library to fetch web pages.
- Use `BeautifulSoup` from the `bs4` module for HTML parsing.
- Ensure compatibility with Python 3.10.
- Follow PEP 8 style guidelines.

## Example Usage

```python
from web_scraper import scrape_url

url = "https://example.com/article"
content = scrape_url(url)
print(content)
```

## Acceptance Criteria

1. The `scrape_url` function successfully retrieves content from various websites.
1. HTML tags, scripts, and other non-text elements are correctly removed.
1. The function handles exceptions gracefully and provides meaningful error messages.
1. Basic rate limiting is implemented to prevent aggressive scraping.
1. The code is well-documented with docstrings and inline comments where necessary.
1. Unit tests are written to cover main functionality and edge cases.

## Additional Notes

- Consider using a user-agent string to identify our scraper to websites.
- Please be aware of websites' robots.txt files and respect their scraping policies.
- This module will be used with our RSS reader and GPT summarizer, so ensure it integrates well with those components.
