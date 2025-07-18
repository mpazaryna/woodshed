# tests/test_data_loading.py

import pytest
import pandas as pd
import os
from load_and_preprocess_data import load_and_preprocess_data

@pytest.fixture
def sample_csv(tmp_path):
    # Create a temporary CSV file
    df = pd.DataFrame({
        'tweet': ['Hello world', 'Test tweet', 'http://test.com', '', 'Short', 'This is a longer tweet that should be retained']
    })
    file_path = tmp_path / "test_data.csv"
    df.to_csv(file_path, index=False)
    return file_path

def test_load_and_preprocess_data(sample_csv):
    result = load_and_preprocess_data(sample_csv)
    assert len(result) == 2  # Should remove short, empty, and URL-containing tweets
    assert 'Hello world' in result['tweet'].values
    assert 'This is a longer tweet that should be retained' in result['tweet'].values
    assert 'http://test.com' not in result['tweet'].values
    assert '' not in result['tweet'].values
    assert 'Short' not in result['tweet'].values