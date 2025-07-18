# Gherkin Scenarios for Web Scraper

## Feature: Scrape URL Content

Scenario: Successfully scrape content from a valid URL
Given a valid URL "https://example.com"
When I call the scrape_url function with the URL
Then the function should return the cleaned text content of the webpage
And the log should contain "Successfully scraped content from https://example.com"

Scenario: Attempt to scrape an invalid URL
Given an invalid URL "invalid-url"
When I call the scrape_url function with the invalid URL
Then the function should raise a FeedFetchError
And the error message should contain "Invalid URL format: invalid-url"

Scenario: Handle network error when scraping URL
Given a valid but unreachable URL "https://nonexistent-website.com"
When I call the scrape_url function with the URL
Then the function should raise a FeedFetchError
And the error message should contain "Error fetching URL https://nonexistent-website.com"

Scenario: Scrape content with custom user agent
Given a valid URL "https://example.com"
And a custom user agent "CustomBot/1.0"
When I call the scrape_url function with the URL and custom user agent
Then the function should return the cleaned text content of the webpage
And the request should be made with the custom user agent

## Feature: Rate Limiting

Scenario: Respect rate limiting when scraping multiple URLs
Given a list of valid URLs
When I call the scrape_url function for each URL in sequence
Then there should be a delay of at least 1 second between each request

## Feature: Content Cleaning

Scenario: Remove script and style elements from scraped content
Given a valid URL "https://example.com" with a page containing script and style tags
When I call the scrape_url function with the URL
Then the returned content should not contain any script or style tags

Scenario: Strip HTML tags from scraped content
Given a valid URL "https://example.com" with a page containing various HTML tags
When I call the scrape_url function with the URL
Then the returned content should be plain text without HTML tags

Scenario: Remove blank lines from scraped content
Given a valid URL "https://example.com" with a page containing blank lines
When I call the scrape_url function with the URL
Then the returned content should not contain any blank lines

## Feature: Error Handling

Scenario: Handle unexpected errors during content processing
Given a valid URL "https://example.com"
And an unexpected error occurs during content processing
When I call the scrape_url function with the URL
Then the function should raise an RSSAIError
And the error message should contain "Error processing content from https://example.com"

## Feature: Logging

Scenario: Log successful scraping operation
Given a valid URL "https://example.com"
When I call the scrape_url function with the URL
Then a log entry should be created with the message "Successfully scraped content from https://example.com"

Scenario: Log error when fetching URL fails
Given a valid but unreachable URL "https://nonexistent-website.com"
When I call the scrape_url function with the URL
Then a log entry should be created with an error message containing "Error fetching URL https://nonexistent-website.com"
