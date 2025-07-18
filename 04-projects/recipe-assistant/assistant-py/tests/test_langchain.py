from langchain_community.callbacks.manager import get_openai_callback
from langchain_openai import ChatOpenAI


def test_langchain_openai_call():
    # Initialize the ChatOpenAI wrapper
    llm = ChatOpenAI(temperature=0)

    # Prepare a simple prompt
    prompt = "What is the capital of France?"

    # Use a callback to capture token usage
    with get_openai_callback() as cb:
        # Make the API call
        response = llm.invoke(prompt)

    # Assert that we got a non-empty response
    assert response.content.strip(), "Expected a non-empty response from OpenAI"

    # Assert that tokens were used (indicating a successful API call)
    assert cb.total_tokens > 0, "Expected to use some tokens in the API call"

    # Optionally, you can check if the response contains the expected answer
    assert "Paris" in response.content, "Expected the response to mention Paris"

    # Print token usage for information (optional)
    print(f"Tokens used: {cb.total_tokens}")
