import json

import pytest

from aiforge.lab.parse_user_dat import parse_user_data
from aiforge.utils.file_utils import get_directory, write_to_file


@pytest.fixture
def setup_test_data():
    test_data = {
        "users": [
            {"id": 1, "name": "John Doe", "email": "john@example.com"},
            {"id": 2, "name": "Jane Smith", "email": "jane@example.com"},
        ]
    }
    filename = "test_user_data.json"
    write_to_file(json.dumps(test_data), filename, "tmp")
    return filename


@pytest.fixture(autouse=True)
def cleanup():
    yield
    # Clean up the test file after each test
    tmp_dir = get_directory("tmp")
    test_file = tmp_dir / "test_user_data.json"
    if test_file.exists():
        test_file.unlink()


def test_parse_user_data(setup_test_data, capsys):
    result = parse_user_data(setup_test_data)

    # Check if the correct number of users is returned
    assert len(result) == 2

    # Check if the user data is correctly parsed
    assert result[0]["name"] == "John Doe"
    assert result[1]["email"] == "jane@example.com"

    # Check if the user information is correctly printed
    captured = capsys.readouterr()
    assert "ID: 1, Name: John Doe, Email: john@example.com" in captured.out
    assert "ID: 2, Name: Jane Smith, Email: jane@example.com" in captured.out


def test_parse_user_data_file_not_found(capsys):
    result = parse_user_data("non_existent_file.json")

    # Check if an empty list is returned when file is not found
    assert result == []

    # Check if the correct error message is printed
    captured = capsys.readouterr()
    assert "Error: File not found in specified location" in captured.out


def test_parse_user_data_invalid_json(setup_test_data):
    # Write invalid JSON to the test file
    write_to_file("invalid json data", setup_test_data, "tmp")

    result = parse_user_data(setup_test_data)

    # Check if an empty list is returned for invalid JSON
    assert result == []


def test_parse_user_data_no_users(setup_test_data):
    # Write JSON with no users to the test file
    write_to_file(json.dumps({"data": "no users here"}), setup_test_data, "tmp")

    result = parse_user_data(setup_test_data)

    # Check if an empty list is returned when no users are found
    assert result == []
