# AI Summarizer Gherkin Scenario

## Feature: Article Summarization

### Scenario: Summarize a new article

Given the AI Summarizer is configured correctly
And there is no cached summary for the article
When I request a summary for a new article
Then the system should generate a summary using OpenAI
And the summary should be cached for future use
And the summary should be returned to the user

### Scenario: Retrieve a cached summary

Given the AI Summarizer is configured correctly
And there is a cached summary for the article
When I request a summary for the article
Then the system should retrieve the cached summary
And return it to the user without calling OpenAI

### Scenario: Handle rate limiting

Given the AI Summarizer is configured correctly
When I make multiple requests in quick succession
Then the system should apply rate limiting
And ensure requests to OpenAI don't exceed the configured rate limit

### Scenario: Error handling for OpenAI API issues

Given the AI Summarizer is configured correctly
When the OpenAI API returns an error
Then the system should log the error
And return an appropriate error message to the user

### Scenario: Summarize article with custom length

Given the AI Summarizer is configured with a custom summary length
When I request a summary for an article
Then the generated summary should not exceed the configured length

## Feature: Configuration Management

### Scenario: Load valid configuration

Given a valid configuration file exists
When the AI Summarizer loads the configuration
Then it should successfully parse all required settings

### Scenario: Handle missing configuration file

Given the configuration file is missing
When the AI Summarizer attempts to load the configuration
Then it should raise an appropriate error
And log the issue

## Feature: Caching System

### Scenario: Cache a new summary

Given the AI Summarizer has generated a new summary
When the summary is saved to the cache
Then it should be stored in the configured cache directory
And the filename should be based on the article title

### Scenario: Retrieve existing summary from cache

Given a summary exists in the cache
When the AI Summarizer attempts to retrieve it
Then it should successfully load the summary from the cache file

### Scenario: Handle cache miss

Given a summary does not exist in the cache
When the AI Summarizer attempts to retrieve it
Then it should return None
And proceed to generate a new summary

## Feature: Integration with URL

### Scenario: Summarize article from URL

Given a valid URL to an article
When I request a summary for the URL
Then the system should fetch the article content
And generate a summary of the article
And return the summary to the user

### Scenario: Handle invalid URL

Given an invalid or inaccessible URL
When I request a summary for the URL
Then the system should return an appropriate error message
And log the issue

## Feature: Logging

### Scenario: Log successful summary generation

Given the AI Summarizer is configured correctly
When a summary is successfully generated
Then the system should log the success event with relevant details

### Scenario: Log error events

Given the AI Summarizer encounters an error
When the error occurs during any operation
Then the system should log the error with appropriate context and stack trace