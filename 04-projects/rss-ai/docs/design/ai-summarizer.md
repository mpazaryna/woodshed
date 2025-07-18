# AI Summarizer Design Document (OpenAI, Functional Approach)

## 1. Overview

The AI Summarizer is a Python-based tool designed to generate concise summaries of articles using OpenAI's GPT models. It provides users with quick, accurate, and formal summaries of lengthy content, improving efficiency in information consumption. This version focuses specifically on OpenAI integration and follows a functional programming approach.

## 2. Key Components

### 2.1 Configuration

- **Config File**: `config.yaml`
  - Contains settings for:
    - OpenAI GPT model version
    - Summary length
    - Rate limiting parameters
    - File paths for data storage

### 2.2 Core Functions

```python
def load_config(config_path: str = 'config.yaml') -> dict:
    """Load and return configuration settings."""
    # Implementation details

def summarize_article(content: str, config: dict) -> str:
    """
    Send content to OpenAI GPT and return a summary.
    
    Args:
    content (str): The full text of the article to be summarized.
    config (dict): Configuration settings.
    
    Returns:
    str: A concise summary of the input article.
    """
    # Implementation details

def cache_summary(title: str, summary: str, config: dict) -> None:
    """Save the generated summary to a file."""
    # Implementation details

def get_cached_summary(title: str, config: dict) -> Optional[str]:
    """Retrieve a cached summary if it exists."""
    # Implementation details

def apply_rate_limiting(config: dict) -> None:
    """Apply rate limiting based on configuration."""
    # Implementation details
```

## 3. Detailed Design

### 3.1 Configuration Management

```python
import yaml

def load_config(config_path: str = 'config.yaml') -> dict:
    with open(config_path, 'r') as file:
        return yaml.safe_load(file)
```

### 3.2 OpenAI Integration

```python
import openai

def generate_summary_with_openai(content: str, config: dict) -> str:
    openai.api_key = config['openai_api_key']
    response = openai.ChatCompletion.create(
        model=config['gpt_model'],
        messages=[
            {"role": "system", "content": "Summarize the following article in a formal tone."},
            {"role": "user", "content": content}
        ],
        max_tokens=config['summary_length']
    )
    return response.choices[0].message['content']
```

### 3.3 Caching System

```python
import os
from pathlib import Path

def cache_summary(title: str, summary: str, config: dict) -> None:
    filename = _generate_filename(title)
    filepath = Path(config['cache_dir']) / filename
    with open(filepath, 'w') as file:
        file.write(summary)

def get_cached_summary(title: str, config: dict) -> Optional[str]:
    filename = _generate_filename(title)
    filepath = Path(config['cache_dir']) / filename
    if filepath.exists():
        with open(filepath, 'r') as file:
            return file.read()
    return None

def _generate_filename(title: str) -> str:
    return f"{title.lower().replace(' ', '_')}.md"
```

### 3.4 Rate Limiting

```python
import time

def apply_rate_limiting(config: dict) -> None:
    time.sleep(config['rate_limit_delay'])
```

### 3.5 Main Summarizer Function

```python
def summarize_article(content: str, title: str, config: dict) -> str:
    cached_summary = get_cached_summary(title, config)
    if cached_summary:
        return cached_summary
    
    apply_rate_limiting(config)
    summary = generate_summary_with_openai(content, config)
    cache_summary(title, summary, config)
    return summary
```

## 4. Error Handling and Logging

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def safe_summarize_article(content: str, title: str, config: dict) -> Optional[str]:
    try:
        return summarize_article(content, title, config)
    except openai.error.RateLimitError:
        logger.error("Rate limit exceeded. Trying again after delay.")
        time.sleep(config['rate_limit_delay'] * 2)
        return summarize_article(content, title, config)
    except Exception as e:
        logger.error(f"Error summarizing article: {str(e)}")
        return None
```

## 5. Testing Strategy

### 5.1 Unit Tests (pytest)

Create a file `test_summarizer.py` with the following structure:

```python
import pytest
from summarizer import load_config, generate_summary_with_openai, cache_summary, get_cached_summary

def test_load_config():
    config = load_config('test_config.yaml')
    assert 'gpt_model' in config
    assert 'summary_length' in config

@pytest.mark.parametrize("content,expected_length", [
    ("Short test content", 50),
    ("Longer test content with more words to summarize", 100),
])
def test_generate_summary_with_openai(content, expected_length, mocker):
    mock_openai = mocker.patch('openai.ChatCompletion.create')
    mock_openai.return_value.choices[0].message = {'content': 'Mocked summary'}
    
    config = {'gpt_model': 'gpt-3.5-turbo', 'summary_length': expected_length}
    summary = generate_summary_with_openai(content, config)
    
    assert len(summary) <= expected_length
    mock_openai.assert_called_once()

def test_cache_summary(tmp_path):
    config = {'cache_dir': str(tmp_path)}
    cache_summary("Test Title", "Test summary content", config)
    
    cached = get_cached_summary("Test Title", config)
    assert cached == "Test summary content"
```

### 5.2 Integration Test (pytest)

Add the following to `test_summarizer.py`:

```python
import requests

def test_summarize_article_integration():
    config = load_config('config.yaml')
    url = "https://example.com/article"
    
    response = requests.get(url)
    content = response.text
    
    summary = summarize_article(content, "Example Article", config)
    
    assert summary is not None
    assert len(summary) <= config['summary_length']
```
