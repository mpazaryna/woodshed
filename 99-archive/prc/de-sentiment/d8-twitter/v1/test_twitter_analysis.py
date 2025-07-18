import pytest
import pandas as pd
import os
import tempfile
from sklearn.feature_extraction.text import TfidfVectorizer
from twitter_analysis import (
    load_and_preprocess_data,
    get_sentiment,
    get_keywords,
    get_top_keywords,
    analyze_themes,
    delta8_analysis,
    THEMES,
    OUTPUT_DIR
)

# Create a fixture for temporary directory
@pytest.fixture
def temp_dir():
    with tempfile.TemporaryDirectory() as tmpdirname:
        yield tmpdirname

# Sample data for testing
@pytest.fixture
def sample_df():
    return pd.DataFrame({
        'tweet': [
            'I love Delta-8 THC!',
            'CBD is great for relaxation.',
            'Is Delta-8 legal?',
            'Just bought some weed.',
            'This high is amazing!'
        ]
    })

def test_load_and_preprocess_data(temp_dir):
    # Create a temporary CSV file with a variety of tweets
    df = pd.DataFrame({
        'tweet': [
            'Hello world',
            'Test tweet',
            'http://test.com',
            '',
            'Short',
            'This is a longer tweet that should definitely be retained',
            'Another tweet with Delta-8 mention'
        ]
    })
    file_path = os.path.join(temp_dir, "test_data.csv")
    df.to_csv(file_path, index=False)
    
    # Test the function
    result = load_and_preprocess_data(file_path)
    
    print("\nDebugging output:")
    print(f"Original tweets ({len(df)}):")
    for tweet in df['tweet']:
        print(f"  - {tweet}")
    
    print(f"\nPreprocessed tweets ({len(result)}):")
    for tweet in result['tweet']:
        print(f"  - {tweet}")
    
    # Basic checks
    assert len(result) > 0, "Preprocessed data should not be empty"
    assert len(result) <= len(df), "Preprocessed data should not have more rows than original"
    
    # Check for expected behaviors
    assert 'http://test.com' not in result['tweet'].values, "Tweet with URL should be removed"
    assert '' not in result['tweet'].values, "Empty tweet should be removed"
    
    # Check for retention of valid tweets
    valid_tweets = [
        'Hello world',
        'Test tweet',
        'This is a longer tweet that should definitely be retained',
        'Another tweet with Delta-8 mention'
    ]
    for tweet in valid_tweets:
        if tweet not in result['tweet'].values:
            print(f"Warning: Expected tweet not found in result: '{tweet}'")
        else:
            print(f"Found expected tweet: '{tweet}'")
    
    # Assert that at least one valid tweet is retained
    assert any(tweet in result['tweet'].values for tweet in valid_tweets), "At least one valid tweet should be retained"

def test_get_sentiment():
    assert get_sentiment("I love this!") > 0
    assert get_sentiment("I hate this!") < 0
    assert get_sentiment("This is neutral.") == 0

def test_get_keywords():
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    corpus = [
        "The quick brown fox jumps over the lazy dog",
        "Quick foxes are known for jumping",
        "Dogs are often lazy"
    ]
    tfidf_matrix = vectorizer.fit_transform(corpus)
    feature_names = vectorizer.get_feature_names_out()
    
    keywords = get_keywords(tfidf_matrix, feature_names, n=3)
    assert len(keywords) == 3
    assert all(isinstance(k, tuple) and len(k) == 2 for k in keywords)
    assert 'the' not in [k[0] for k in keywords]  # 'the' should be removed as a stopword
    print(f"Extracted keywords: {keywords}")

def test_get_top_keywords(sample_df):
    top_keywords = get_top_keywords(sample_df, n=5)
    assert len(top_keywords) == 5
    assert all(isinstance(k, tuple) and len(k) == 2 for k in top_keywords)
    print(f"Top keywords: {top_keywords}")

def test_analyze_themes(sample_df):
    theme_counts = analyze_themes(sample_df)
    assert isinstance(theme_counts, pd.DataFrame)
    assert set(theme_counts['Theme']) == set(THEMES.keys())
    assert all(theme_counts['Count'] >= 0)
    assert all(0 <= percentage <= 100 for percentage in theme_counts['Percentage'])

# Test the plotting functions (these tests just check if the files are created)
def test_plot_sentiment_distribution(sample_df, temp_dir):
    from twitter_analysis import plot_sentiment_distribution
    
    sample_df['sentiment'] = sample_df['tweet'].apply(get_sentiment)
    output_file = os.path.join(temp_dir, "test_sentiment.png")
    plot_sentiment_distribution(sample_df, "Test", output_file)
    assert os.path.exists(output_file)

def test_plot_keyword_frequency(temp_dir):
    from twitter_analysis import plot_keyword_frequency
    
    keywords = [('test', 5), ('python', 3), ('pytest', 2)]
    output_file = os.path.join(temp_dir, "test_keywords.png")
    plot_keyword_frequency(keywords, "Test", output_file)
    assert os.path.exists(output_file)

def test_plot_theme_frequency(temp_dir):
    from twitter_analysis import plot_theme_frequency
    
    theme_counts = pd.DataFrame({
        'Theme': list(THEMES.keys()),
        'Count': [2, 3, 1, 4],
        'Percentage': [20, 30, 10, 40]
    })
    output_file = os.path.join(temp_dir, "test_themes.png")
    plot_theme_frequency(theme_counts, "Test", output_file)
    assert os.path.exists(output_file)

def test_create_wordcloud(sample_df, temp_dir):
    from twitter_analysis import create_wordcloud
    
    output_file = os.path.join(temp_dir, "test_wordcloud.png")
    create_wordcloud(sample_df, "Test", output_file)
    assert os.path.exists(output_file)

@pytest.fixture
def sample_df_with_sentiment():
    df = pd.DataFrame({
        'tweet': [
            'I love Delta-8 THC!',
            'CBD is great for relaxation.',
            'Is Delta-8 legal?',
            'Just bought some weed.',
            'This high is amazing!'
        ]
    })
    df['sentiment'] = df['tweet'].apply(get_sentiment)
    return df

def test_delta8_analysis(sample_df_with_sentiment, temp_dir):
    # Print the DataFrame for debugging
    print("\nDebugging output:")
    print(sample_df_with_sentiment)
    
    output_file = os.path.join(temp_dir, "test_delta8.txt")
    
    try:
        delta8_analysis(sample_df_with_sentiment, output_file)
    except Exception as e:
        print(f"Error occurred during delta8_analysis: {str(e)}")
        raise
    
    assert os.path.exists(output_file), f"Output file {output_file} was not created"
    
    with open(output_file, 'r') as f:
        content = f.read()
        print(f"\nDelta-8 analysis content:\n{content}")
        
        assert "Delta-8" in content, "Delta-8 should be mentioned in the analysis"
        assert "Number of Delta-8 related tweets:" in content, "Number of Delta-8 tweets should be reported"
        assert "Percentage of Delta-8 related tweets:" in content, "Percentage of Delta-8 tweets should be reported"
        assert "Average sentiment of Delta-8 tweets:" in content, "Average sentiment should be reported"

# Test the main function (this is more of an integration test)
def test_main(temp_dir, monkeypatch):
    from twitter_analysis import main, FILE_PATHS
    
    # Create temporary input files
    for file_key, _ in FILE_PATHS.items():
        df = pd.DataFrame({
            'tweet': ['Test tweet 1', 'Test tweet 2', 'Delta-8 is great']
        })
        file_path = os.path.join(temp_dir, f"{file_key}.csv")
        df.to_csv(file_path, index=False)
        monkeypatch.setitem(FILE_PATHS, file_key, file_path)
    
    # Set output directory to a temporary directory
    test_output_dir = os.path.join(temp_dir, "output")
    os.makedirs(test_output_dir, exist_ok=True)
    monkeypatch.setattr("twitter_analysis.OUTPUT_DIR", test_output_dir)
    
    # Run the main function
    main()
    
    # Check if output files are created
    assert os.path.exists(os.path.join(test_output_dir, "comparison_results.txt"))
    assert os.path.exists(os.path.join(test_output_dir, "sentiment_distribution_file1.png"))
    assert os.path.exists(os.path.join(test_output_dir, "keyword_frequency_file1.png"))
    assert os.path.exists(os.path.join(test_output_dir, "theme_frequency_file1.csv"))
    assert os.path.exists(os.path.join(test_output_dir, "delta8_analysis_file1.txt"))
