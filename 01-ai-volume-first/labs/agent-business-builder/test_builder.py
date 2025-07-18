import pytest
from business_builder import process_pipeline


def test_process_pipeline():
    # Given a sample user input prompt
    business_prompt = (
        "My business is to sell custom AI image model to companies that sell physical products "
        "(such as sunglasses, fashion, phone cases, ... or anything else). Those companies spend "
        "thousands of dollars on photographs, models, travelling, sample products, studios, etc. "
        "We can give them high-quality creatives that include their exact product, just as it appears "
        "in real life, for a fraction of the cost it takes to do these photoshoots. I want to use "
        "instagram to find companies who need this, but I don't know how to start, or what to do, or what to "
        "message them. Please help."
    )

    # When the process_pipeline function is called
    strategy = process_pipeline(business_prompt)

    # Then ensure that the strategy is not empty and contains expected information
    assert strategy is not None
    assert isinstance(strategy, str)
    assert len(strategy) > 0
