import os
import pandas as pd
from keyword_analysis import get_top_keywords

OUTPUT_DIR = "/teamspace/studios/this_studio/prc/d8-twitter/output"


def compare_datasets(
    df1: pd.DataFrame,
    df2: pd.DataFrame,
    theme_counts1: pd.DataFrame,
    theme_counts2: pd.DataFrame,
):
    """Compare two datasets and save the results."""
    comparison_results = [
        "Dataset Comparison:",
        f"File 1: {len(df1)} tweets",
        f"File 2: {len(df2)} tweets",
        f"\nAverage Sentiment:",
        f"File 1: {df1['sentiment'].mean():.4f}",
        f"File 2: {df2['sentiment'].mean():.4f}",
        "\nTop 10 Keywords Comparison:",
    ]

    kw1 = dict(get_top_keywords(df1))
    kw2 = dict(get_top_keywords(df2))
    all_words = set(kw1.keys()) | set(kw2.keys())

    for word in all_words:
        comparison_results.append(
            f"{word}: File 1 - {kw1.get(word, 0)}, File 2 - {kw2.get(word, 0)}"
        )

    comparison_results.append("\nTheme Comparison:")
    themes = theme_counts1["Theme"].tolist()
    for theme in themes:
        pct1 = theme_counts1[theme_counts1["Theme"] == theme]["Percentage"].values[0]
        pct2 = theme_counts2[theme_counts2["Theme"] == theme]["Percentage"].values[0]
        comparison_results.append(
            f"{theme}: File 1 - {pct1:.2f}%, File 2 - {pct2:.2f}%"
        )

    with open(os.path.join(OUTPUT_DIR, "comparison_results.txt"), "w") as f:
        f.write("\n".join(comparison_results))
