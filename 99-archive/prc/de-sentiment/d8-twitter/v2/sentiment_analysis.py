from nltk.sentiment import SentimentIntensityAnalyzer

def get_sentiment(text: str) -> float:
    """Calculate the sentiment score for a given text."""
    return SentimentIntensityAnalyzer().polarity_scores(text)['compound']
