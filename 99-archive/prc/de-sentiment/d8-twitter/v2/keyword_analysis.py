from sklearn.feature_extraction.text import TfidfVectorizer

def get_keywords(tfidf_matrix, feature_names, n=10):
    sorted_items = sorted(zip(feature_names, tfidf_matrix.sum(axis=0).tolist()[0]), key=lambda x: x[1], reverse=True)
    return sorted_items[:n] if n is not None else sorted_items

def get_top_keywords(df, n=10):
    vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(df['tweet'])
    feature_names = vectorizer.get_feature_names_out()
    return get_keywords(tfidf_matrix, feature_names, n)
