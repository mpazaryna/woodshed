import pytest
import google.generativeai as genai
import gemini_cli

def test_get_model():
    model = gemini_cli.get_model()
    assert isinstance(model, genai.GenerativeModel)
    assert model.model_name == "models/gemini-1.5-pro-latest"

def test_generate_content(caplog):
    prompt = "What is the capital of France?"
    response = gemini_cli.generate_content(prompt)
    
    if response is None:
        # Check if the expected error message is in the logs
        assert "Max retries reached. Unable to generate content." in caplog.text
        pytest.skip("API request failed after max retries, skipping further assertions")
    else:
        assert isinstance(response, str)
        assert len(response) > 0
        assert "paris" in response.lower()

def test_generate_content_empty_prompt(caplog):
    result = gemini_cli.generate_content("")  # Use the fully qualified name
    assert "Max retries reached. Unable to generate content." in caplog.text
    assert result is None  # or whatever your function returns in case of failure

@pytest.mark.parametrize("prompt", [
    "What is 2+2?",
    "Who wrote Romeo and Juliet?",
    "What is the boiling point of water?",
])
def test_generate_content_multiple_prompts(prompt):
    """
    Test the generate_content function with multiple prompts.
    
    This test checks if the function can handle various prompts and return
    valid responses. It also accounts for potential API quota exhaustion:
    
    1. If a response is received, it verifies that:
       - The response is not None
       - The response is a non-empty string
    
    2. If the API quota is exceeded (response is None):
       - The test is skipped to avoid false negatives
    
    Parameters:
    prompt (str): The input prompt to test
    
    Note: This test may be skipped if the API quota is exceeded.
    """
    response = gemini_cli.generate_content(prompt)
    
    if response is None:
        pytest.skip("API quota exceeded, skipping test")
    else:
        assert response is not None
        assert isinstance(response, str)
        assert len(response) > 0
        # Add more specific assertions here if needed

def test_safety_settings():
    model = gemini_cli.get_model()

    # Assert that _safety_settings is a dictionary
    assert isinstance(model._safety_settings, dict)

    # Assert that there are 4 safety categories
    assert len(model._safety_settings) == 4

    # Import the necessary enums
    from google.generativeai.types import HarmCategory, HarmBlockThreshold

    # Check for expected keys using enum values
    expected_keys = [
        HarmCategory.HARM_CATEGORY_HARASSMENT,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT
    ]
    for key in expected_keys:
        assert key in model._safety_settings, f"Expected safety category {key} not found"

    # Check the structure of a safety setting
    for setting in model._safety_settings.values():
        assert isinstance(setting, HarmBlockThreshold), "Each safety setting should be a HarmBlockThreshold enum"

    # You can add more specific checks here if needed

def test_generation_config():
    model = gemini_cli.get_model()
    assert model._generation_config['temperature'] == 0.9
    assert model._generation_config['top_p'] == 1
    assert model._generation_config['top_k'] == 1
    assert model._generation_config['max_output_tokens'] == 2048