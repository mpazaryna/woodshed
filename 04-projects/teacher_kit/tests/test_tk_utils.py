# test_json_util.py

import json
import os

import pytest

from teacher_kit.utils.json_util import read_json_file, write_json_file


def test_read_json_file():
    file_path = "/Users/mpaz/workspace/woodshed-ai/teacher_kit/data/asana.json"

    # Call the function to read the JSON file
    data = read_json_file(file_path)

    # Check if the data is a list
    assert isinstance(data, list), "The JSON data should be a list."

    # Optionally, check if the first element is a dictionary
    assert all(
        isinstance(item, dict) for item in data
    ), "Each item in the JSON data should be a dictionary."

    # Optionally, check for specific keys in the first dictionary
    if data:
        assert "id" in data[0], "The key 'id' should be present in each dictionary."
        assert "name" in data[0], "The key 'name' should be present in each dictionary."


def test_write_json_file(tmp_path):
    # Define the file path using pytest's tmp_path fixture
    file_path = "/Users/mpaz/workspace/woodshed-ai/teacher_kit/data/test_output.json"

    # Define the data to be written
    data = [{"id": 1, "name": "Test Item"}]

    # Call the function to write the JSON file
    write_json_file(file_path, data)

    # Read the file back to verify its contents
    with open(file_path, "r", encoding="utf-8") as file:
        written_data = json.load(file)

    # Check if the written data matches the original data
    assert (
        written_data == data
    ), "The data written to the JSON file should match the input data."


# Run the test using pytest
# pytest test_utils_json.py
