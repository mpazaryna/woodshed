# Gherkin Scenarios for RSS Fetcher

## Feature: Load RSS Feeds

Scenario: Successfully load feeds from a YAML file
Given a valid YAML file with RSS feed URLs exists at "feeds.yaml"
When I call the load_feeds function with "feeds.yaml"
Then the function should return a dictionary of feed names and URLs
And the log should contain "Successfully loaded X feeds from feeds.yaml"

Scenario: Attempt to load feeds from a non-existent file
Given a file "nonexistent.yaml" does not exist
When I call the load_feeds function with "nonexistent.yaml"
Then the function should raise a ParseError
And the log should contain "Feed file not found: nonexistent.yaml"

Scenario: Attempt to load feeds from an invalid YAML file
Given an invalid YAML file exists at "invalid.yaml"
When I call the load_feeds function with "invalid.yaml"
Then the function should raise a ParseError
And the log should contain "Error parsing YAML file"

## Feature: Fetch RSS Feed

Scenario: Successfully fetch and parse an RSS feed
Given a valid RSS feed URL "http://example.com/rss"
When I call the fetch_rss function with the URL
Then the function should return a list of article dictionaries
And each article should have title, link, published_parsed, and summary fields
And the log should contain entry details for each article

Scenario: Attempt to fetch an invalid RSS feed
Given an invalid RSS feed URL "http://example.com/invalid"
When I call the fetch_rss function with the URL
Then the function should raise a FeedFetchError
And the log should contain "Error fetching RSS feed from http://example.com/invalid"

## Feature: Filter Recent Articles

Scenario: Filter articles within the specified time range
Given a list of articles with various publication dates
And a time range of 7 days
When I call the filter_recent_articles function
Then the function should return only articles published within the last 7 days
And the log should contain "Filtered X recent articles out of Y total articles"

Scenario: Handle articles with invalid date format
Given a list of articles including some with invalid publication dates
And a time range of 7 days
When I call the filter_recent_articles function
Then the function should skip articles with invalid dates
And the log should contain warnings for articles with invalid date formats

## Feature: Get Recent Articles from All Feeds

Scenario: Successfully retrieve recent articles from multiple feeds
Given a valid YAML file with multiple RSS feed URLs
And a time range of 7 days
When I call the get_recent_articles function
Then the function should return a list of recent articles from all feeds
And each article should have a feed_name field
And the log should contain "Retrieved a total of X recent articles from all feeds"

Scenario: Handle errors in individual feeds
Given a YAML file with both valid and invalid RSS feed URLs
And a time range of 7 days
When I call the get_recent_articles function
Then the function should return articles from valid feeds
And skip feeds that raise exceptions
And the log should contain error messages for failed feeds
