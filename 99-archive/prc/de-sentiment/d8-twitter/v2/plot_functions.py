import os
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from typing import List, Tuple
from wordcloud import WordCloud

OUTPUT_DIR = "/teamspace/studios/this_studio/prc/d8-twitter/output"

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
