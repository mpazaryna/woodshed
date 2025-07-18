import json

import pytest

from aiforge.config import config
from aiforge.utils.file_utils import get_directory, get_file, write_to_file


@pytest.fixture(scope="module")
def setup_test_data():
    # Create a sample user_data.json file in the tmp directory
    sample_data = {
        "users": [
            {"id": 1, "name": "John Doe", "email": "john@example.com"},
            {"id": 2, "name": "Jane Smith", "email": "jane@example.com"},
        ]
    }
    write_to_file(json.dumps(sample_data), "user_data.json")  # Uses tmp by default


def test_user_data_file_content(setup_test_data):
    content = get_file("user_data.json")  # Uses tmp by default
    data = json.loads(content)
    assert "users" in data
    assert isinstance(data["users"], list)


def test_user_data_structure(setup_test_data):
    content = get_file("user_data.json")  # Uses tmp by default
    data = json.loads(content)

    assert "users" in data
    for user in data["users"]:
        assert "id" in user
        assert "name" in user
        assert "email" in user


def test_file_not_found():
    with pytest.raises(FileNotFoundError):
        get_file("non_existent_file.json")  # Uses tmp by default


def test_invalid_json(setup_test_data):
    # Create a temporary file with invalid JSON
    write_to_file("invalid json", "invalid_user_data.json")  # Uses tmp by default

    with pytest.raises(json.JSONDecodeError):
        content = get_file("invalid_user_data.json")  # Uses tmp by default
        json.loads(content)


def test_missing_users_key(setup_test_data):
    # Create a temporary file with missing 'users' key
    write_to_file(
        json.dumps({"data": []}), "missing_key_user_data.json"
    )  # Uses tmp by default

    content = get_file("missing_key_user_data.json")  # Uses tmp by default
    data = json.loads(content)

    assert "users" not in data


def test_write_and_read_file():
    content = "Test content"
    filename = "test_file.txt"

    # Write to file
    file_path = write_to_file(content, filename)  # Uses tmp by default
    assert file_path.exists()
    assert file_path.parent == get_directory("tmp")

    # Read from file
    read_content = get_file(filename)  # Uses tmp by default
    assert read_content == content


def test_directory_usage():
    assert get_directory() == config.tmp_dir
    assert get_directory("tmp") == config.tmp_dir
    assert get_directory("data") == config.data_dir

    with pytest.raises(ValueError):
        get_directory("invalid_directory")
