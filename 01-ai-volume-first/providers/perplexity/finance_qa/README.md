# Finance Q&A Application Development Prompts

This document captures the sequence of prompts that led to the development of the Finance Q&A application, along with the original code provided.

## Initial Submission

Build a functional Python app where users enter a finance question. Do not use OOP.  All code should be fully commented with docstring, and there should be a module-level docstring.  The API is instructed to produce up to 5 related questions to answer the particular question and perform a perplexity search for each question in parallel.

Use this code as an example of how to call perplexity.

```python
from openai import OpenAI

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

messages = [
    {
        "role": "system",
        "content": (
            "You are an artificial intelligence assistant and you need to "
            "engage in a helpful, detailed, polite conversation with a user."
        ),
    },
    {
        "role": "user",
        "content": (
            "How many stars are in the universe?"
        ),
    },
]

client = OpenAI(api_key=PERPLEXITY_API_KEY, base_url="https://api.perplexity.ai")

# chat completion without streaming
response = client.chat.completions.create(
    model="llama-3.1-sonar-large-128k-online",
    messages=messages,
)
print(response)

# chat completion with streaming
response_stream = client.chat.completions.create(
    model="llama-3.1-sonar-large-128k-online",
    messages=messages,
    stream=True,
)
for response in response_stream:
    print(response)
```

## Development Prompts Sequence

### First Enhancement Request

> create a v2 of this code, that will also save the results to a markdown file using the same naming convention as the json file

### Directory Structure Request

> create a v3 of this code that will write the files to the relative path data/output/perplexity_finance and after the test run, provides a prompt to ask the user if they want to ask again or exit, if exit, the code should be terminated

### Progress Indicator Request

> can you create a v4 that gives an indication that the code is running, maybe something like a series of dots in the console

### Testing Request

> please generate a simple single integration test, no mocks, that asks the question and ensures the file has been written into the folder i supplied

### Analysis of Prompt Pattern

The prompt sequence shows a clear progression:

1. Started with core functionality enhancement (markdown output)
2. Moved to structural improvements (directory organization and user flow)
3. Added user experience features (progress indication)
4. Concluded with quality assurance (testing)
5. Finally requested documentation for prompt improvement

Notable characteristics of the prompts:

- Clear and concise requests
- Each prompt built upon the previous version
- Specific requirements were clearly stated
- Technical details were explicitly mentioned
- Incremental improvements were requested instead of large changes