# (link unavailable)

import re
from sklearn.feature_extraction.text import TfidfVectorizer
from textblob import TextBlob

def preprocess_tweet(text: str) -> str:
    """
    Remove URLs and special characters from a tweet and convert to lowercase.

    Args:
        text (str): The tweet text

    Returns:
        str: The preprocessed tweet text
    """
    text = re.sub(r'http\S+', '', text)
    text = re.sub('[^A-Za-z ]+', '', text)
    return text.lower()

def extract_keywords(tweet: str) -> str:
    """
    Extract keywords from a single tweet using TF-IDF.

    Args:
        tweet (str): The tweet text

    Returns:
        str: The extracted keywords separated by commas
    """
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform([tweet])
        feature_names = vectorizer.get_feature_names_out()
        return ", ".join(feature_names)
    except ValueError:
        return ""  # Return empty string if no content is left after preprocessing

def analyze_sentiment(tweet: str) -> tuple:
    """
    Analyze the sentiment of a tweet using TextBlob.

    Args:
        tweet (str): The tweet text

    Returns:
        tuple: A tuple containing the sentiment polarity and subjectivity
    """
    analysis = TextBlob(tweet)
    return analysis.sentiment.polarity, analysis.sentiment.subjectivity