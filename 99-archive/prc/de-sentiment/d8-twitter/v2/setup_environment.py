import nltk
import os

# Constants
NLTK_DOWNLOADS = ['vader_lexicon', 'punkt', 'stopwords']
OUTPUT_DIR = "/teamspace/studios/this_studio/prc/d8-twitter/output"

def setup_environment():
    """Set up the environment by downloading NLTK data and creating output directory."""
    for resource in NLTK_DOWNLOADS:
        nltk.download(resource, quiet=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)
