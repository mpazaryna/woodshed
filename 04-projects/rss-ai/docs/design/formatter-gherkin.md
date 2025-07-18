# Formatter Gherkin Scenarios

## Feature: Format Article Summary

As a user of the AI-powered RSS news summarizer
I want the summarized articles to be formatted consistently
So that I can easily read and understand the summarized content

### Scenario: Format a complete article summary

  Given I have an article with all required fields
  And I have an AI-generated summary
  When I format the summary
  Then I should see a properly formatted Markdown output
  And the output should contain the article title
  And the output should contain the source name
  And the output should contain the publication date
  And the output should contain the formatted summary
  And the output should contain the article URL

### Scenario: Format an article with missing fields

  Given I have an article with some missing fields
  And I have an AI-generated summary
  When I format the summary
  Then I should see a properly formatted Markdown output
  And the output should contain placeholder text for missing fields

### Scenario: Format an article with a long title

  Given I have an article with a title longer than 100 characters
  And I have an AI-generated summary
  When I format the summary
  Then I should see a properly formatted Markdown output
  And the title should be truncated to 100 characters
  And the title should end with an ellipsis

### Scenario: Format an article with a long summary

  Given I have an article with all required fields
  And I have an AI-generated summary longer than 500 words
  When I format the summary
  Then I should see a properly formatted Markdown output
  And the summary should be truncated to 500 words
  And the summary should end with a "Read more" link

### Scenario: Format an article in HTML

  Given I have an article with all required fields
  And I have an AI-generated summary
  And I specify HTML as the output format
  When I format the summary
  Then I should see a properly formatted HTML output
  And the output should contain appropriate HTML tags

### Scenario: Format an article with special characters

  Given I have an article with special characters in the title and summary
  When I format the summary
  Then I should see a properly formatted Markdown output
  And the special characters should be properly escaped

### Scenario: Format multiple articles

  Given I have a list of articles with their summaries
  When I format all the summaries
  Then I should see a list of properly formatted Markdown outputs
  And each output should be separated by a horizontal rule

### Scenario: Format an article with a custom template

  Given I have an article with all required fields
  And I have an AI-generated summary
  And I provide a custom output template
  When I format the summary
  Then I should see an output formatted according to the custom template

### Scenario: Handle an empty summary

  Given I have an article with all required fields
  And I have an empty AI-generated summary
  When I format the summary
  Then I should see a properly formatted Markdown output
  And the output should contain a message indicating no summary is available

### Scenario: Format an article with non-ASCII characters

  Given I have an article with non-ASCII characters in the title and summary
  When I format the summary
  Then I should see a properly formatted Markdown output
  And the non-ASCII characters should be preserved correctly