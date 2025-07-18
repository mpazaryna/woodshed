import pandas as pd

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
