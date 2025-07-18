from recipe_assistant.openai_kit import generate_insights, logger


def test_generate_insights():
    logger.info("Starting test_generate_insights")
    # Sample recipe data
    recipes = """
    1. Spaghetti Carbonara (Italian): pasta, eggs, pancetta, cheese
    2. Chicken Tikka Masala (Indian): chicken, yogurt, tomatoes, spices
    3. Sushi Rolls (Japanese): rice, nori, fish, vegetables
    4. Tacos al Pastor (Mexican): pork, pineapple, onions, cilantro
    5. Beef Bourguignon (French): beef, red wine, mushrooms, onions
    """

    result = generate_insights(recipes)

    assert isinstance(result, dict)
    assert len(result) >= 3  # We expect at least 3 insights

    # Check if keys are properly formatted
    for key in result.keys():
        assert key.startswith(("trend_", "insight_", "observation_"))
        assert "_" in key
        assert key.replace("_", " ").replace(" ", "").isalnum()  # Allow spaces

    # Check if values are non-empty strings
    for value in result.values():
        assert isinstance(value, str)
        assert len(value) > 0

    logger.info("Finished test_generate_insights")
    # Print the results for manual inspection
    print("\nGenerated Insights:")
    for key, value in result.items():
        print(f"{key}: {value}")
