import time
from collections import Counter

import nltk
import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from textblob import TextBlob

# Download necessary NLTK data
nltk.download("punkt", quiet=True)
nltk.download("stopwords", quiet=True)


def extract_keywords(text):
    words = word_tokenize(str(text).lower())
    stop_words = set(stopwords.words("english"))
    keywords = [word for word in words if word.isalnum() and word not in stop_words]
    return keywords


def get_sentiment(text):
    blob = TextBlob(str(text))
    sentiment = blob.sentiment.polarity
    if sentiment > 0:
        return "Positive"
    elif sentiment < 0:
        return "Negative"
    else:
        return "Neutral"


def process_dataframe(df):
    processed_df = df[
        ["Document ID", "Tracking Number", "Posted Date", "Comment"]
    ].copy()
    processed_df["Keywords"] = processed_df["Comment"].apply(extract_keywords)
    processed_df["Sentiment"] = processed_df["Comment"].apply(get_sentiment)
    processed_df["Sentiment_Score"] = processed_df["Comment"].apply(
        lambda x: TextBlob(str(x)).sentiment.polarity
    )
    return processed_df


def analyze_sentiment(df):
    sentiment_distribution = df["Sentiment"].value_counts(normalize=True) * 100
    average_sentiment = df["Sentiment_Score"].mean()
    return sentiment_distribution, average_sentiment


def get_df_size_info(dataframe):
    memory_usage = dataframe.memory_usage(deep=True).sum()
    return {
        "Shape": dataframe.shape,
        "Memory usage (MB)": memory_usage / 1e6,
        "Number of columns": len(dataframe.columns),
    }


def compare_dataframes(original_df, processed_df):
    original_size = original_df.memory_usage(deep=True).sum()
    processed_size = processed_df.memory_usage(deep=True).sum()
    size_difference = original_size - processed_size
    size_difference_percentage = (size_difference / original_size) * 100
    return {
        "Original size (MB)": original_size / 1e6,
        "Processed size (MB)": processed_size / 1e6,
        "Difference (MB)": size_difference / 1e6,
        "Difference (%)": size_difference_percentage,
    }


def extract_and_count_keywords(df):
    all_keywords = [word for keywords in df["Keywords"] for word in keywords]
    keyword_counts = Counter(all_keywords)
    sorted_keywords = sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True)
    return sorted_keywords


def profile_function(func, *args, **kwargs):
    start_time = time.time()
    result = func(*args, **kwargs)
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"{func.__name__} execution time: {execution_time:.4f} seconds")
    return result, execution_time
