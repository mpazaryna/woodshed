# AI Summarizer Prompts

I would like to build the ai-summarizer one function at a time, following the design document and the gherkin scenarios.  The code should be functional, not OOP.  Here's the first scenario.

Scenario: Summarize a new article

Given the AI Summarizer is configured correctly
And there is no cached summary for the article
When I request a summary for a new article
Then the system should generate a summary using OpenAI
And the summary should be cached for future use
And the summary should be returned to the user

## Integration test

Please write a test_summarizer_integration test, that goes to the url, @https://openai.com/index/introducing-openai-o1-preview/  and provides a summary.  Write a pytest the ensures some text has been returned.
