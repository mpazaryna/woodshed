# Q&A Application

An asynchronous command-line application that leverages the Perplexity API to generate comprehensive insights by analyzing questions and providing related follow-up questions with answers.

## Features

- 🤖 Utilizes Perplexity API for intelligent question analysis
- 🔄 Asynchronous processing for efficient handling of multiple questions
- 📝 Generates related follow-up questions for deeper insights
- 💾 Saves results in both JSON and Markdown formats
- 🎨 Interactive CLI with progress animations
- 📊 Structured output with clear formatting
- 🔒 Secure API key handling through environment variables

## Prerequisites

- Python 3.10+
- Perplexity API key

## Usage

### Basic Usage

The application will:

1. Prompt you to specify if you want to log output to a file
2. Ask for your question
3. Request the type of expert perspective you want
4. Generate and process related questions
5. Display answers and save results

### Advanced Usage

You can also run the application with pre-defined parameters:

```python
import asyncio
from main import main

asyncio.run(main(
    question="What are the key factors in retirement planning?",
    expert_type="financial advisor",
    log_to_file=True
))
```

## Configuration

The application uses an immutable `ConfigTuple` for settings:

- `output_dir`: Directory for saving results (default: "data/output/questions")
- `log_file`: Log file location (default: "app.log")
- `model_name`: Perplexity model (default: "llama-3.1-sonar-large-128k-online")
- `base_url`: API base URL (default: "https://api.perplexity.ai")

## Output Formats

### JSON Output

Results are saved in JSON format with the following structure:

```json
{
  "original_question": "user's question",
  "timestamp": "YYYYMMDD_HHMMSS",
  "results": [
    {
      "question": "question text",
      "answer": "answer text"
    }
  ]
}
```

### Markdown Output

Results are also saved in a formatted Markdown file including:

- Timestamp
- Original question
- List of all questions and answers
- Clear section formatting

## Error Handling

The application includes comprehensive error handling for:

- Missing API keys
- Invalid user input
- API communication errors
- Keyboard interrupts

## Acknowledgments

- Built with the Perplexity API
- Uses OpenAI's API client structure
- Async support through asyncio

## pdocs

```bash
poetry run pdoc --output-dir docs questions 
```