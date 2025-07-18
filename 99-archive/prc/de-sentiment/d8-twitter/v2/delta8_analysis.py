import os
import pandas as pd
from keyword_analysis import get_top_keywords

OUTPUT_DIR = "/teamspace/studios/this_studio/prc/d8-twitter/output"


def delta8_analysis(df: pd.DataFrame, filename: str):
    """Perform Delta-8 specific analysis and save results."""
    delta8_tweets = df[
        df["tweet"].str.contains("Delta-8|Delta 8|D8", case=False, regex=True)
    ]

    results = [
        f"Number of Delta-8 related tweets: {len(delta8_tweets)}",
        f"Percentage of Delta-8 related tweets: {len(delta8_tweets) / len(df) * 100:.2f}%",
        f"Average sentiment of Delta-8 tweets: {delta8_tweets['sentiment'].mean():.4f}",
        "Top keywords in Delta-8 tweets:",
    ]

    delta8_keywords = get_top_keywords(delta8_tweets, 15)
    results.extend([f"{word}: {count}" for word, count in delta8_keywords])

    with open(os.path.join(OUTPUT_DIR, filename), "w") as f:
        f.write("\n".join(results))
