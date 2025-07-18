import json
import logging

import pytest

from aiforge.config import config
from aiforge.utils.file_utils import get_file, write_to_file
from aiforge.utils.json_utils import (JSONProcessingError, process_json_data,
                                      read_json_file, write_json_file)

# Ensure the logs directory exists
config.ensure_directories_exist()


@pytest.fixture(scope="session", autouse=True)
def setup_logging():
    """Set up logging for the test session."""
    log_file = config.logs_dir / "pytest.log"
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)",
        handlers=[logging.FileHandler(log_file), logging.StreamHandler()],
    )


@pytest.fixture
def setup_test_data():
    test_data = {
        "users": [
            {"id": 1, "name": "John Doe", "email": "john@example.com"},
            {"id": 2, "name": "Jane Smith", "email": "jane@example.com"},
        ],
        "settings": {"theme": "dark", "notifications": {"email": True, "push": False}},
    }
    filename = "test_data.json"
    write_to_file(json.dumps(test_data), filename, "tmp")
    return filename


@pytest.fixture(autouse=True)
def cleanup():
    yield
    # Clean up the test file after each test
    test_file = config.tmp_dir / "test_data.json"
    if test_file.exists():
        test_file.unlink()


def test_process_json_data(setup_test_data, caplog):
    caplog.set_level(logging.INFO)
    json_data = get_file(setup_test_data, "tmp")

    # Test without key path
    result = process_json_data(json_data)
    assert isinstance(result, dict)
    assert "users" in result
    assert "settings" in result

    # Test with key path
    result = process_json_data(json_data, "users.0.name")
    assert result == "John Doe"

    # Test with nested key path
    result = process_json_data(json_data, "settings.notifications.email")
    assert result is True

    # Test with invalid key path
    with pytest.raises(JSONProcessingError):
        process_json_data(json_data, "invalid.key.path")

    # Check for the info log
    assert (
        "JSON processing error: Key 'invalid' not found at level 1 of the JSON structure"
        in caplog.text
    )


def test_read_json_file(setup_test_data):
    result = read_json_file(setup_test_data, "tmp", key_path="users.1.name")
    assert result == "Jane Smith"

    result = read_json_file(setup_test_data, "tmp", key_path="users.0.name")
    assert result == "John Doe"


def test_read_json_file_not_found(caplog):
    caplog.set_level(logging.INFO)
    result = read_json_file("non_existent.json", "tmp")
    assert result is None
    assert "File non_existent.json not in tmp directory" in caplog.text


def test_write_json_file(caplog):
    caplog.set_level(logging.INFO)
    data = {"key": "value"}
    filename = "output.json"

    result = write_json_file(data, filename, "tmp")
    assert result is True
    assert f"Successfully wrote JSON data to {filename} in tmp directory" in caplog.text

    # Verify the written data
    written_data = json.loads(get_file(filename, "tmp"))
    assert written_data == data

    # Clean up
    (config.tmp_dir / filename).unlink()


def test_write_json_file_error(caplog):
    caplog.set_level(logging.ERROR)
    data = {"key": "value"}
    # Attempt to write to a directory that doesn't exist
    result = write_json_file(data, "test.json", "non_existent_dir")
    assert result is False
    assert "Error writing JSON data to file:" in caplog.text


def test_json_processing_error(caplog):
    caplog.set_level(logging.INFO)
    invalid_json = '{"key": "value"'  # Missing closing brace
    with pytest.raises(JSONProcessingError):
        process_json_data(invalid_json)
    assert "JSON processing error: Invalid JSON format:" in caplog.text


def test_logging_process_json_data_error(caplog):
    caplog.set_level(logging.INFO)
    invalid_json = '{"key": "value"'  # Missing closing brace
    with pytest.raises(JSONProcessingError):
        process_json_data(invalid_json)
    assert "JSON processing error: Invalid JSON format:" in caplog.text


def test_logging_navigate_json_error(setup_test_data, caplog):
    caplog.set_level(logging.INFO)
    json_data = get_file(setup_test_data, "tmp")
    with pytest.raises(JSONProcessingError):
        process_json_data(json_data, "users.3.name")  # Index out of range
    assert (
        "JSON processing error: Index 3 is out of range at level 2 of the JSON structure"
        in caplog.text
    )
