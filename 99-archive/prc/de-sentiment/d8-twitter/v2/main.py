import pandas as pd
import os
from setup_environment import setup_environment
from load_and_preprocess_data import load_and_preprocess_data
from sentiment_analysis import get_sentiment
from keyword_analysis import get_top_keywords
from theme_analysis import analyze_themes
from plot_functions import (
    plot_sentiment_distribution,
    plot_keyword_frequency,
    plot_theme_frequency,
    create_wordcloud,
)
from compare_datasets import compare_datasets
from delta8_analysis import delta8_analysis

# Constants
FILE_PATHS = {
    "file1": "/teamspace/studios/this_studio/prc/d8-twitter/data/raw/02-clean-pre-cleaned.csv",
    "file2": "/teamspace/studios/this_studio/prc/d8-twitter/data/raw/02-clean-post-cleaned.csv",
}

OUTPUT_DIR = "/teamspace/studios/this_studio/prc/d8-twitter/output"


def load_and_preprocess_dataframes():
    """Load and preprocess data from specified file paths."""
    dataframes = {}
    for file_key, file_path in FILE_PATHS.items():
        try:
            dataframes[file_key] = load_and_preprocess_data(file_path)
            print(f"Successfully loaded and preprocessed data from {file_path}")
            print(f"{file_key}: {len(dataframes[file_key])} tweets")
        except Exception as e:
            print(f"Error loading or preprocessing data from {file_path}: {str(e)}")
            return {}
    return dataframes


def perform_sentiment_analysis(dataframes):
    """Perform sentiment analysis on the dataframes."""
    for df in dataframes.values():
        df["sentiment"] = df["tweet"].apply(get_sentiment)


def perform_keyword_and_theme_analysis(dataframes):
    """Perform keyword and theme analysis on the dataframes."""
    keywords = {file_key: get_top_keywords(df) for file_key, df in dataframes.items()}
    theme_counts = {file_key: analyze_themes(df) for file_key, df in dataframes.items()}
    return keywords, theme_counts


def create_visualizations(dataframes, keywords, theme_counts):
    """Create visualizations for sentiment distribution, keyword frequency, and theme frequency."""
    for file_key, df in dataframes.items():
        plot_sentiment_distribution(
            df,
            file_key.capitalize(),
            os.path.join(OUTPUT_DIR, f"sentiment_distribution_{file_key}.png"),
        )
        plot_keyword_frequency(
            keywords[file_key],
            file_key.capitalize(),
            os.path.join(OUTPUT_DIR, f"keyword_frequency_{file_key}.png"),
        )
        plot_theme_frequency(
            theme_counts[file_key],
            file_key.capitalize(),
            os.path.join(OUTPUT_DIR, f"theme_frequency_{file_key}.png"),
        )
        create_wordcloud(
            df,
            file_key.capitalize(),
            os.path.join(OUTPUT_DIR, f"wordcloud_{file_key}.png"),
        )


def compare_and_analyze_delta8(dataframes, theme_counts):
    """Compare datasets and perform Delta-8 specific analysis."""
    compare_datasets(
        dataframes["file1"],
        dataframes["file2"],
        theme_counts["file1"],
        theme_counts["file2"],
    )

    for file_key, df in dataframes.items():
        delta8_analysis(df, os.path.join(OUTPUT_DIR, f"delta8_analysis_{file_key}.txt"))


def save_theme_counts(theme_counts):
    """Save theme counts to CSV files."""
    for file_key, counts in theme_counts.items():
        counts.to_csv(
            os.path.join(OUTPUT_DIR, f"theme_frequency_{file_key}.csv"), index=False
        )


def analyze_twitter_data():
    """Function to orchestrate the Twitter data analysis."""
    setup_environment()

    dataframes = load_and_preprocess_dataframes()
    if not dataframes:
        return

    perform_sentiment_analysis(dataframes)

    keywords, theme_counts = perform_keyword_and_theme_analysis(dataframes)

    create_visualizations(dataframes, keywords, theme_counts)

    compare_and_analyze_delta8(dataframes, theme_counts)

    save_theme_counts(theme_counts)

    print(f"All analysis results have been saved to the '{OUTPUT_DIR}' folder.")


def main():
    analyze_twitter_data()


if __name__ == "__main__":
    main()
