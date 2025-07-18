import pandas as pd
from keyword_analysis import get_keywords
from sklearn.feature_extraction.text import TfidfVectorizer

THEMES = {
    "Cannabis Types and Components": ["delta", "thc", "cbd"],
    "User Experience": ["high", "weed"],
    "Legality and Regulation": ["legal"],
    "General Conversation": ["like", "just", "shit"]
}

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
