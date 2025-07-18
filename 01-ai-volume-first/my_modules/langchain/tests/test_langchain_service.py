import os

import pytest

from woodshed.modules.langchain.langchain_service import get_langchain_service


@pytest.fixture(params=["openai", "gemini"])
async def langchain_service(request):
    llm_type = request.param
    api_key_env = "OPENAI_API_KEY" if llm_type == "openai" else "GOOGLE_API_KEY"

    if not os.getenv(api_key_env):
        pytest.skip(f"{api_key_env} not in environment")

    print(f"\nCreating service for {llm_type}")
    service = await get_langchain_service()
    print(f"Service created: {type(service)}")

    service.config["llm"]["default"] = llm_type
    await service.initialize_llm()
    print(f"LLM initialized for {llm_type}")

    return service


@pytest.mark.asyncio
async def test_generate_response(langchain_service):
    service = await langchain_service  # Await the fixture here
    print(f"\nIn test_generate_response. Service type: {type(service)}")
    prompt = "You are a helpful assistant. Respond to the following: {input}"
    input_text = "Tell me about artificial intelligence."

    print("Calling generate_response")
    response = await service.generate_response(prompt, input_text)
    print(f"Response received: {response[:50]}...")  # Print first 50 chars

    assert response, "Response should not be empty"
    assert isinstance(response, str), "Response should be a string"
    assert len(response) > 10, "Response should be a meaningful length"


@pytest.mark.asyncio
async def test_summarize_text(langchain_service):
    service = await langchain_service  # Await the fixture here
    print(f"\nIn test_summarize_text. Service type: {type(service)}")
    text = "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans."

    print("Calling summarize_text")
    summary = await service.summarize_text(text)
    print(f"Summary received: {summary[:50]}...")  # Print first 50 chars

    assert summary, "Summary should not be empty"
    assert isinstance(summary, str), "Summary should be a string"
    # assert len(summary) < len(text), "Summary should be shorter than the original text"
