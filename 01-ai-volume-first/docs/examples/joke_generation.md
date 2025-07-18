# Example: Joke Generation with Structured Output

This example demonstrates how to use structured output with a language model to generate jokes in a consistent format, using the `structured_data.py` file in the woodshed project.

## Workflow Description

```gherkin
Feature: Structured Joke Generation
  As a user of the AI system
  I want to generate jokes with a consistent structure
  So that I can easily use and process the generated jokes

  Scenario: Generating a cat joke
    Given the AI model is initialized with structured output capabilities
    When I request a joke about cats
    Then I should receive a joke with a setup and punchline
    And the joke should be about cats
    And the joke may optionally include a humor rating

  Scenario: Printing a generated joke
    Given a joke has been generated
    When I call the print_joke function
    Then the joke's setup and punchline should be displayed
    And if a rating is present, it should also be displayed
```

## Code Overview

Let's examine the key parts of `examples/structured_data.py`:

```python
from typing import Optional
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

class Joke(BaseModel):
    setup: str = Field(description="The setup of the joke")
    punchline: str = Field(description="The punchline to the joke")
    rating: Optional[int] = Field(
        default=None, description="How funny the joke is, from 1 to 10"
    )

def get_joke():
    llm = ChatOpenAI(model="gpt-4o-mini")
    structured_llm = llm.with_structured_output(Joke)
    joke_output = structured_llm.invoke("Tell me a joke about cats")
    return joke_output

def print_joke():
    joke = get_joke()
    print(joke)

# Call the function to print the joke
print_joke()
```

## Explanation

1. The `Joke` class uses Pydantic to define the structure we want our jokes to follow. This ensures our output will always have a setup, punchline, and optional rating.

2. The `get_joke()` function:
   - Initializes a ChatOpenAI model
   - Uses `with_structured_output(Joke)` to ensure the model's output conforms to our `Joke` structure
   - Invokes the model with a prompt to generate a cat joke

3. The `print_joke()` function calls `get_joke()` and prints the result.

## Running the Example

To run this example, navigate to the directory containing `structured_data.py` and execute:

```bash
python structured_data.py
```

You should see output similar to the following:

```
setup='Why don't cats play poker in the jungle?' punchline='Too many cheetahs!' rating=None
```

## Learning Points

1. **Structured Output**: By using Pydantic and `with_structured_output()`, we ensure that the language model's output always follows our specified structure.

2. **Modularity**: The code separates joke generation (`get_joke()`) from presentation (`print_joke()`), allowing for easy modification or extension.

3. **Type Hinting**: The use of type hints (e.g., `Optional[int]`) improves code readability and can catch potential errors.

4. **Field Descriptions**: The `Field()` function allows us to provide descriptions for each field, which can guide the language model in generating appropriate content.

## Suggestions for Experimentation

1. Modify the `Joke` class to include additional fields, such as "category" or "appropriate_for_kids".
2. Update `get_joke()` to accept a topic parameter, allowing jokes on different subjects.
3. Implement error handling to gracefully deal with cases where the model might not generate a valid joke structure.
4. Create a function to rate the jokes, perhaps using another AI model call.

## Conclusion

This example demonstrates how structured output can be used to generate content (in this case, jokes) with a consistent format. This approach makes it easier to work with the generated content programmatically, ensuring that we always get the expected fields in our joke objects.

By studying and experimenting with this code, you can gain a deeper understanding of how to use language models to generate structured data, a powerful technique in many AI applications.