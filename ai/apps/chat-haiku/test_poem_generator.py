import pytest
from poem_generator import generate_poem

def test_generate_poem_returns_text():
    # Test with a haiku
    haiku_result = generate_poem("nature", "haiku")
    assert isinstance(haiku_result, list), "Expected a list for haiku"
    assert all(isinstance(line, str) for line in haiku_result), "Expected list elements to be strings"
    assert all(line.strip() for line in haiku_result), "Expected non-empty strings in haiku result"

    # Test with a limerick
    limerick_result = generate_poem("funny", "limerick")
    assert isinstance(limerick_result, list), "Expected a list for limerick"
    assert isinstance(limerick_result[0], str), "Expected a string for limerick"
    assert limerick_result[0].strip(), "Expected a non-empty string for limerick result"