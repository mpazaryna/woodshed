"""
Test module for arxiv_kit utilities.

This module contains tests for saving results to JSON and downloading papers
from a file. It ensures that the functionalities work as expected.
"""

import json
import os
import time

from arxiv_kit.utils import (
    download_papers_from_file,
    fetch_arxiv_results,
    save_results_to_json,
)


def test_save_json():
    """
    Test the saving of search results to a JSON file.

    This function fetches results based on a search query, saves them to a
    JSON file, and validates that the file exists and is not empty.
    """
    search_query = "all:LangChain"
    results = fetch_arxiv_results(
        search_query, total_results=10, results_per_iteration=5
    )
    json_file_path = "data/arxiv_results.json"

    save_results_to_json(results, json_file_path)

    assert os.path.exists(json_file_path), "JSON file does not exist."

    with open(json_file_path, "r") as f:
        data = json.load(f)
        # Validate that the JSON file is not empty by checking the length of the data
        assert len(data) > 0, "JSON file is empty."


def test_download_papers_from_file():
    """
    Test downloading papers from a specified file.

    This function creates a temporary file with an arXiv ID, calls the
    download function, and checks if the corresponding PDF file is
    downloaded successfully.
    """
    # Call the function to download papers listed in "download.txt"
    download_papers_from_file("download.txt")

    # Wait a moment to ensure the file has time to download
    time.sleep(2)

    # Check if the PDF file was downloaded with the correct name
    expected_file_path = "./data/2403.05568v1.pdf"
    assert os.path.exists(expected_file_path), "Expected PDF file was not downloaded."
