import pytest
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from keyword_extraction import get_keywords, get_top_keywords

# Sample dataframe for testing
sample_data = {
    "tweet": [
        "The quick brown fox jumps over the lazy dog",
        "Never jump over the lazy dog quickly",
        "Bright and early bird catches the worm",
        "Every morning the bird is early and bright",
    ]
}
df = pd.DataFrame(sample_data)


def test_get_keywords():
    vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(df["tweet"])
    feature_names = vectorizer.get_feature_names_out()

    keywords = get_keywords(tfidf_matrix, feature_names, n=10)

    print(f"Extracted keywords: {keywords}")

    assert isinstance(keywords, list), "The result should be a list"
    assert all(
        isinstance(item, tuple) for item in keywords
    ), "Each item in the list should be a tuple"
    assert len(keywords) == 10, "The length of the result list should be 10"
    assert all(
        isinstance(word, str) for word, score in keywords
    ), "The first element of each tuple should be a string"
    assert all(
        isinstance(score, float) for word, score in keywords
    ), "The second element of each tuple should be a float"

    extracted_words = [word for word, score in keywords]
    assert all(
        word in feature_names for word in extracted_words
    ), "All extracted words should be in the feature names"

    # Check that specific words are in the top keywords
    expected_words = {"bird", "bright", "early"}
    assert expected_words.issubset(
        set(extracted_words)
    ), "The expected words should be in the extracted keywords"


def test_get_top_keywords():
    top_keywords = get_top_keywords(df, n=10)

    print(f"Top keywords: {top_keywords}")

    assert isinstance(top_keywords, list), "The result should be a list"
    assert all(
        isinstance(item, tuple) for item in top_keywords
    ), "Each item in the list should be a tuple"
    assert len(top_keywords) == 10, "The length of the result list should be 10"
    assert all(
        isinstance(word, str) for word, score in top_keywords
    ), "The first element of each tuple should be a string"
    assert all(
        isinstance(score, float) for word, score in top_keywords
    ), "The second element of each tuple should be a float"

    vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
    vectorizer.fit(df["tweet"])
    feature_names = vectorizer.get_feature_names_out()

    extracted_words = [word for word, score in top_keywords]
    assert all(
        word in feature_names for word in extracted_words
    ), "All extracted words should be in the feature names"

    # Check that specific words are in the top keywords
    expected_words = {"bird", "bright", "early"}
    assert expected_words.issubset(
        set(extracted_words)
    ), "The expected words should be in the extracted keywords"


if __name__ == "__main__":
    pytest.main()
