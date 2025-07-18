import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter
import os
from wordcloud import WordCloud
import nltk
from typing import List, Dict, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer

# Constants
OUTPUT_DIR = 'output'
NLTK_DOWNLOADS = ['vader_lexicon', 'punkt', 'stopwords']
FILE_PATHS = {
    'file1': '/teamspace/studios/this_studio/prc/d8-twitter/data/raw/02-clean-pre-cleaned.csv',
    'file2': '/teamspace/studios/this_studio/prc/d8-twitter/data/raw/02-clean-post-cleaned.csv'
}
THEMES = {
    "Cannabis Types and Components": ["delta", "thc", "cbd"],
    "User Experience": ["high", "weed"],
    "Legality and Regulation": ["legal"],
    "General Conversation": ["like", "just", "shit"]
}

def setup_environment():
    """Set up the environment by downloading NLTK data and creating output directory."""
    for resource in NLTK_DOWNLOADS:
        nltk.download(resource, quiet=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_and_preprocess_data(file_path: str) -> pd.DataFrame:
    """
    Load and preprocess the data from a CSV file.
    
    Args:
    file_path (str): Path to the CSV file.
    
    Returns:
    pd.DataFrame: Preprocessed DataFrame.
    """
    df = pd.read_csv(file_path)
    df = df.dropna()
    df = df.drop_duplicates(subset='tweet', keep='first')
    df = df[df['tweet'].str.len() > 10]
    df = df[~df['tweet'].str.contains('http')]
    return df

def get_sentiment(text: str) -> float:
    """Calculate the sentiment score for a given text."""
    return SentimentIntensityAnalyzer().polarity_scores(text)['compound']

def get_keywords(tfidf_matrix, feature_names, n=10):
    sorted_items = sorted(zip(feature_names, tfidf_matrix.sum(axis=0).tolist()[0]), key=lambda x: x[1], reverse=True)
    return sorted_items[:n] if n is not None else sorted_items

def get_top_keywords(df, n=10):
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(df['tweet'])
    feature_names = vectorizer.get_feature_names_out()
    return get_keywords(tfidf_matrix, feature_names, n)

def analyze_themes(df):
    theme_counts = {theme: 0 for theme in THEMES}
    
    # Get keywords for all tweets at once
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(df['tweet'])
    feature_names = vectorizer.get_feature_names_out()
    all_keywords = get_keywords(tfidf_matrix, feature_names, n=None)
    
    # Create a set of all keywords for faster lookup
    all_keywords_set = set(word for word, _ in all_keywords)
    
    for theme, theme_keywords in THEMES.items():
        theme_counts[theme] = sum(1 for keyword in theme_keywords if keyword in all_keywords_set)
    
    df_theme_counts = pd.DataFrame(theme_counts.items(), columns=['Theme', 'Count'])
    df_theme_counts['Percentage'] = df_theme_counts['Count'] / len(df) * 100
    return df_theme_counts

def plot_sentiment_distribution(df: pd.DataFrame, title: str, filename: str):
    """Plot and save the sentiment distribution."""
    plt.figure(figsize=(10, 6))
    sns.histplot(df['sentiment'], kde=True)
    plt.title(f'Sentiment Distribution - {title}')
    plt.xlabel('Sentiment Score')
    plt.ylabel('Frequency')
    plt.savefig(os.path.join(OUTPUT_DIR, filename))
    plt.close()

def plot_keyword_frequency(keywords: List[Tuple[str, int]], title: str, filename: str):
    """Plot and save the keyword frequency."""
    words, counts = zip(*keywords)
    plt.figure(figsize=(12, 6))
    sns.barplot(x=list(words), y=list(counts))
    plt.title(f'Top Keywords - {title}')
    plt.xlabel('Keywords')
    plt.ylabel('Frequency')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, filename))
    plt.close()

def plot_theme_frequency(df_theme_counts: pd.DataFrame, title: str, filename: str):
    """Plot and save the theme frequency."""
    plt.figure(figsize=(12, 6))
    sns.barplot(x='Theme', y='Percentage', data=df_theme_counts)
    plt.title(f'Theme Frequency - {title}')
    plt.xlabel('Theme')
    plt.ylabel('Percentage of Tweets')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, filename))
    plt.close()

def compare_datasets(df1: pd.DataFrame, df2: pd.DataFrame, theme_counts1: pd.DataFrame, theme_counts2: pd.DataFrame):
    """Compare two datasets and save the results."""
    comparison_results = [
        "Dataset Comparison:",
        f"File 1: {len(df1)} tweets",
        f"File 2: {len(df2)} tweets",
        f"\nAverage Sentiment:",
        f"File 1: {df1['sentiment'].mean():.4f}",
        f"File 2: {df2['sentiment'].mean():.4f}",
        "\nTop 10 Keywords Comparison:"
    ]
    
    kw1 = dict(get_top_keywords(df1))
    kw2 = dict(get_top_keywords(df2))
    all_words = set(kw1.keys()) | set(kw2.keys())
    
    for word in all_words:
        comparison_results.append(f"{word}: File 1 - {kw1.get(word, 0)}, File 2 - {kw2.get(word, 0)}")
    
    comparison_results.append("\nTheme Comparison:")
    themes = theme_counts1['Theme'].tolist()
    for theme in themes:
        pct1 = theme_counts1[theme_counts1['Theme'] == theme]['Percentage'].values[0]
        pct2 = theme_counts2[theme_counts2['Theme'] == theme]['Percentage'].values[0]
        comparison_results.append(f"{theme}: File 1 - {pct1:.2f}%, File 2 - {pct2:.2f}%")
    
    with open(os.path.join(OUTPUT_DIR, 'comparison_results.txt'), 'w') as f:
        f.write('\n'.join(comparison_results))

def create_wordcloud(df: pd.DataFrame, title: str, filename: str):
    """Create and save a word cloud."""
    all_text = ' '.join(df['tweet'])
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(all_text)
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.title(f'Word Cloud - {title}')
    plt.tight_layout(pad=0)
    plt.savefig(os.path.join(OUTPUT_DIR, filename), bbox_inches='tight')
    plt.close()

def delta8_analysis(df: pd.DataFrame, filename: str):
    """Perform Delta-8 specific analysis and save results."""
    delta8_tweets = df[df['tweet'].str.contains('Delta-8|Delta 8|D8', case=False, regex=True)]
    
    results = [
        f"Number of Delta-8 related tweets: {len(delta8_tweets)}",
        f"Percentage of Delta-8 related tweets: {len(delta8_tweets) / len(df) * 100:.2f}%",
        f"Average sentiment of Delta-8 tweets: {delta8_tweets['sentiment'].mean():.4f}",
        "Top keywords in Delta-8 tweets:"
    ]
    
    delta8_keywords = get_top_keywords(delta8_tweets, 15)
    results.extend([f"{word}: {count}" for word, count in delta8_keywords])
    
    with open(os.path.join(OUTPUT_DIR, filename), 'w') as f:
        f.write('\n'.join(results))

def main():
    """Main function to orchestrate the Twitter data analysis."""
    setup_environment()
    
    # Load and preprocess data
    dataframes = {}
    for file_key, file_path in FILE_PATHS.items():
        try:
            dataframes[file_key] = load_and_preprocess_data(file_path)
            print(f"Successfully loaded and preprocessed data from {file_path}")
            print(f"{file_key}: {len(dataframes[file_key])} tweets")
        except Exception as e:
            print(f"Error loading or preprocessing data from {file_path}: {str(e)}")
            return
    
    # Perform sentiment analysis
    for df in dataframes.values():
        df['sentiment'] = df['tweet'].apply(get_sentiment)
    
    # Perform keyword and theme analysis
    keywords = {file_key: get_top_keywords(df) for file_key, df in dataframes.items()}
    theme_counts = {file_key: analyze_themes(df) for file_key, df in dataframes.items()}
    
    # Create visualizations
    for file_key, df in dataframes.items():
        plot_sentiment_distribution(df, file_key.capitalize(), f'sentiment_distribution_{file_key}.png')
        plot_keyword_frequency(keywords[file_key], file_key.capitalize(), f'keyword_frequency_{file_key}.png')
        plot_theme_frequency(theme_counts[file_key], file_key.capitalize(), f'theme_frequency_{file_key}.png')
        create_wordcloud(df, file_key.capitalize(), f'wordcloud_{file_key}.png')
    
    # Compare datasets
    compare_datasets(dataframes['file1'], dataframes['file2'], theme_counts['file1'], theme_counts['file2'])
    
    # Perform Delta-8 specific analysis
    for file_key, df in dataframes.items():
        delta8_analysis(df, f'delta8_analysis_{file_key}.txt')
    
    # Save theme counts
    for file_key, counts in theme_counts.items():
        counts.to_csv(os.path.join(OUTPUT_DIR, f'theme_frequency_{file_key}.csv'), index=False)
    
    print(f"All analysis results have been saved to the '{OUTPUT_DIR}' folder.")

if __name__ == "__main__":
    main()
