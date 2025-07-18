# src/delta_8_analysis/analysis.py

import csv
import os
import re
from collections import Counter

import matplotlib.pyplot as plt
import nltk
from nltk import pos_tag
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from wordcloud import WordCloud

# Download necessary NLTK data
nltk.download("punkt", quiet=True)
nltk.download("averaged_perceptron_tagger", quiet=True)
nltk.download("stopwords", quiet=True)
nltk.download("vader_lexicon", quiet=True)

# Define directories relative to the project root
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "output")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)


def load_data(file_name):
    file_path = os.path.join(DATA_DIR, file_name)
    with open(file_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        return list(reader)


def preprocess_text(text):
    text = re.sub(r"[^a-zA-Z\s]", "", text.lower())
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words("english"))
    tokens = [token for token in tokens if token not in stop_words]
    tokens = [word for word, pos in pos_tag(tokens) if pos.startswith(("N", "V", "J"))]
    return tokens


def extract_keywords(texts, top_n=100):
    all_words = []
    for text in texts:
        all_words.extend(preprocess_text(text["tweet"]))
    return Counter(all_words).most_common(top_n)


def compare_keywords(pre_keywords, post_keywords):
    pre_set = set(dict(pre_keywords).keys())
    post_set = set(dict(post_keywords).keys())
    common = pre_set.intersection(post_set)
    pre_only = pre_set - post_set
    post_only = post_set - pre_set
    return common, pre_only, post_only


def generate_themes(keywords):
    themes = {
        "Cannabis Types and Components": ["delta", "thc", "cbd", "weed", "marijuana"],
        "User Experience": ["high", "sleep", "pain", "anxiety", "effect"],
        "Legality and Regulation": ["legal", "fda", "cdc", "ban", "regulation"],
        "Product Types": ["gummy", "edible", "vape", "cart", "oil"],
        "Comparison": ["like", "better", "different", "similar", "compared"],
        "General Sentiment": ["good", "bad", "great", "love", "hate"],
    }

    keyword_themes = {}
    for keyword, _ in keywords:
        for theme, theme_keywords in themes.items():
            if keyword in theme_keywords:
                if theme not in keyword_themes:
                    keyword_themes[theme] = []
                keyword_themes[theme].append(keyword)

    return keyword_themes


def analyze_sentiment(text):
    sia = SentimentIntensityAnalyzer()
    scores = sia.polarity_scores(text)
    return {
        "positive": scores["pos"],
        "negative": scores["neg"],
        "neutral": scores["neu"],
        "compound": scores["compound"],
    }


def calculate_and_save_sentiment(input_file, output_file):
    data = load_data(input_file)

    with open(
        os.path.join(OUTPUT_DIR, output_file), "w", newline="", encoding="utf-8"
    ) as f:
        fieldnames = list(data[0].keys()) + [
            "sentiment_positive",
            "sentiment_negative",
            "sentiment_neutral",
            "sentiment_compound",
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for row in data:
            sentiment_scores = analyze_sentiment(row["tweet"])
            row.update(
                {
                    "sentiment_positive": sentiment_scores["positive"],
                    "sentiment_negative": sentiment_scores["negative"],
                    "sentiment_neutral": sentiment_scores["neutral"],
                    "sentiment_compound": sentiment_scores["compound"],
                }
            )
            writer.writerow(row)

    print(f"Sentiment analysis complete. Results written to '{output_file}'")


def generate_wordcloud(keywords, output_file):
    wordcloud = WordCloud(
        width=800, height=400, background_color="white"
    ).generate_from_frequencies(dict(keywords))

    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation="bilinear")
    plt.axis("off")
    plt.tight_layout(pad=0)

    plt.savefig(os.path.join(OUTPUT_DIR, output_file), dpi=300, bbox_inches="tight")
    plt.close()

    print(f"Word cloud saved to '{output_file}'")


def summarize_differences(pre_keywords, post_keywords, pre_sentiment, post_sentiment):
    common, pre_only, post_only = compare_keywords(pre_keywords, post_keywords)

    summary = "Summary of Differences:\n\n"

    summary += "1. Keyword Changes:\n"
    summary += f"   - {len(common)} keywords are common to both periods.\n"
    summary += f"   - {len(pre_only)} keywords are unique to the pre-period.\n"
    summary += f"   - {len(post_only)} keywords are unique to the post-period.\n\n"

    summary += "   Notable new keywords in post-period:\n"
    for keyword in list(post_only)[:5]:  # Show top 5 new keywords
        summary += f"   - {keyword}\n"
    summary += "\n"

    summary += "   Notable keywords missing in post-period:\n"
    for keyword in list(pre_only)[:5]:  # Show top 5 missing keywords
        summary += f"   - {keyword}\n"
    summary += "\n"

    summary += "2. Sentiment Changes:\n"
    summary += f"   Pre-period average sentiments:\n"
    summary += f"   - Positive: {pre_sentiment['positive']:.4f}\n"
    summary += f"   - Negative: {pre_sentiment['negative']:.4f}\n"
    summary += f"   - Neutral: {pre_sentiment['neutral']:.4f}\n"
    summary += f"   - Compound: {pre_sentiment['compound']:.4f}\n\n"
    summary += f"   Post-period average sentiments:\n"
    summary += f"   - Positive: {post_sentiment['positive']:.4f}\n"
    summary += f"   - Negative: {post_sentiment['negative']:.4f}\n"
    summary += f"   - Neutral: {post_sentiment['neutral']:.4f}\n"
    summary += f"   - Compound: {post_sentiment['compound']:.4f}\n\n"

    compound_change = post_sentiment["compound"] - pre_sentiment["compound"]
    summary += f"   - Overall compound sentiment change: {compound_change:.4f}\n"
    if compound_change > 0:
        summary += (
            "   The overall sentiment has become more positive in the post-period.\n"
        )
    elif compound_change < 0:
        summary += (
            "   The overall sentiment has become more negative in the post-period.\n"
        )
    else:
        summary += "   The overall sentiment remains largely unchanged.\n"

    return summary


def main():
    pre_data = load_data("02-clean-pre-cleaned.csv")
    post_data = load_data("02-clean-post-cleaned.csv")

    calculate_and_save_sentiment("02-clean-pre-cleaned.csv", "pre-with-sentiment.csv")
    calculate_and_save_sentiment("02-clean-post-cleaned.csv", "post-with-sentiment.csv")

    pre_keywords = extract_keywords(pre_data)
    post_keywords = extract_keywords(post_data)

    generate_wordcloud(pre_keywords, "pre_period_wordcloud.png")
    generate_wordcloud(post_keywords, "post_period_wordcloud.png")

    all_keywords = pre_keywords + [
        kw for kw in post_keywords if kw[0] not in dict(pre_keywords)
    ]
    themes = generate_themes(all_keywords)

    pre_sentiment = {
        "positive": sum(analyze_sentiment(row["tweet"])["positive"] for row in pre_data)
        / len(pre_data),
        "negative": sum(analyze_sentiment(row["tweet"])["negative"] for row in pre_data)
        / len(pre_data),
        "neutral": sum(analyze_sentiment(row["tweet"])["neutral"] for row in pre_data)
        / len(pre_data),
        "compound": sum(analyze_sentiment(row["tweet"])["compound"] for row in pre_data)
        / len(pre_data),
    }
    post_sentiment = {
        "positive": sum(
            analyze_sentiment(row["tweet"])["positive"] for row in post_data
        )
        / len(post_data),
        "negative": sum(
            analyze_sentiment(row["tweet"])["negative"] for row in post_data
        )
        / len(post_data),
        "neutral": sum(analyze_sentiment(row["tweet"])["neutral"] for row in post_data)
        / len(post_data),
        "compound": sum(
            analyze_sentiment(row["tweet"])["compound"] for row in post_data
        )
        / len(post_data),
    }

    summary = summarize_differences(
        pre_keywords, post_keywords, pre_sentiment, post_sentiment
    )

    with open(os.path.join(OUTPUT_DIR, "delta_8_analysis_results.txt"), "w") as f:
        f.write("Delta 8 Analysis Results\n")
        f.write("========================\n\n")

        f.write("Top Keywords (Pre-period):\n")
        for keyword, count in pre_keywords[:20]:
            f.write(f"{keyword}: {count}\n")
        f.write("\n")

        f.write("Top Keywords (Post-period):\n")
        for keyword, count in post_keywords[:20]:
            f.write(f"{keyword}: {count}\n")
        f.write("\n")

        f.write("Generated Themes:\n")
        for theme, keywords in themes.items():
            f.write(f"{theme}: {', '.join(keywords)}\n")
        f.write("\n")

        f.write("Sentiment Analysis:\n")
        f.write("Pre-period average sentiments:\n")
        for key, value in pre_sentiment.items():
            f.write(f"- {key.capitalize()}: {value:.4f}\n")
        f.write("\nPost-period average sentiments:\n")
        for key, value in post_sentiment.items():
            f.write(f"- {key.capitalize()}: {value:.4f}\n")
        f.write("\n")

        f.write(summary)

    print("Analysis complete. Results written to 'delta_8_analysis_results.txt'")
    print(
        "Individual tweet sentiments saved in 'pre-with-sentiment.csv' and 'post-with-sentiment.csv'"
    )
    print(
        "Word clouds saved as 'pre_period_wordcloud.png' and 'post_period_wordcloud.png'"
    )


if __name__ == "__main__":
    main()
