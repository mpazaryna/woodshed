# Formatter Design Document

## 1. Overview

The Formatter is a crucial component of our AI-powered RSS news summarizer application. Its primary purpose is to take the summarized article data and format it into a clean, readable, and consistent presentation format.

## 2. Key Components

### 2.1 Main Function: `format_summary`

```python
def format_summary(article_data: Dict, summary: str) -> str:
    # Implementation details to be added
    pass
```

- **Input**:
  - `article_data`: A dictionary containing metadata about the article (title, source, publication date, URL)
  - `summary`: The AI-generated summary of the article
- **Output**: A string containing the formatted summary in Markdown

### 2.2 Helper Functions

#### 2.2.1 `format_header`

```python
def format_header(article_data: Dict) -> str:
    # Implementation details to be added
    pass
```

- Formats the article metadata (title, source, date) into a consistent header

#### 2.2.2 `format_body`

```python
def format_body(summary: str) -> str:
    # Implementation details to be added
    pass
```

- Formats the summary text, possibly breaking it into paragraphs or bullet points

#### 2.2.3 `format_footer`

```python
def format_footer(article_data: Dict) -> str:
    # Implementation details to be added
    pass
```

- Formats the article URL and any additional metadata

## 3. Output Format

The formatted output will be in Markdown, with the following structure:

```markdown
## [Article Title]

**Source**: [Source Name]
**Date**: [Publication Date]

[Formatted Summary]

[Read more]([Article URL])
```

## 4. Customization Options

- Allow for different output formats (e.g., HTML, plain text) through a format parameter
- Implement character or word limits for summaries
- Add options for including or excluding specific metadata fields

## 5. Integration

The `format_summary` function will be called after the article summarization process in the main application flow:

```python
for article in articles:
    summary = summarize_article(article['link'])
    formatted_output = format_summary(article, summary)
    # Further processing (e.g., sending to messaging platforms)
```

## 6. Future Enhancements

- Implement templates for different output styles
- Add support for embedding images or other media from the original article
- Create options for different summary lengths (short, medium, long)
- Implement locale-specific formatting for dates and times

## 7. Error Handling

- Implement graceful handling of missing data fields
- Provide fallback formatting options for unexpected input types

## 8. Testing

- Unit tests for each helper function
- Integration tests with sample article data and summaries
- Edge case testing with minimal or excessive input data
