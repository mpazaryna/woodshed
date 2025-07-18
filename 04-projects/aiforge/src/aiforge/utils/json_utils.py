import json
import logging
from typing import Any, Dict, List, Optional, Union

from aiforge.utils.file_utils import get_file, write_to_file

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class JSONProcessingError(Exception):
    """Custom exception class for JSON processing errors."""

    pass


def parse_json_data(json_data: Union[str, bytes, Dict, List]) -> Union[Dict, List]:
    """Parse JSON data if it's a string or bytes, otherwise return as is."""
    if isinstance(json_data, (str, bytes)):
        try:
            return json.loads(json_data)
        except json.JSONDecodeError as e:
            raise JSONProcessingError(f"Invalid JSON format: {str(e)}")
    return json_data


def navigate_json(data: Union[Dict, List], keys: List[str]) -> Any:
    """Navigate through the JSON structure based on the given keys."""
    for i, key in enumerate(keys):
        if isinstance(data, dict):
            if key not in data:
                raise JSONProcessingError(
                    f"Key '{key}' not found at level {i + 1} of the JSON structure"
                )
            data = data[key]
        elif isinstance(data, list) and key.isdigit():
            index = int(key)
            if index >= len(data):
                raise JSONProcessingError(
                    f"Index {index} is out of range at level {i + 1} of the JSON structure"
                )
            data = data[index]
        else:
            raise JSONProcessingError(
                f"Invalid key '{key}' at level {i + 1} for the current JSON structure"
            )
    return data


def process_json_data(
    json_data: Union[str, bytes, Dict, List], key_path: Optional[str] = None
) -> Any:
    """
    Process JSON data and return the specified data based on the key path.

    :param json_data: JSON data as a string, bytes, dictionary, or list
    :param key_path: Dot-separated string indicating the path to the desired data
    :return: The data at the specified key path, or the entire data if no key path is provided
    :raises JSONProcessingError: If there's an error processing the JSON data
    """
    try:
        data = parse_json_data(json_data)

        if not key_path:
            return data

        keys = key_path.split(".")
        return navigate_json(data, keys)

    except JSONProcessingError as e:
        logger.info(f"JSON processing error: {str(e)}")  # Changed to INFO level
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing JSON data: {str(e)}")
        raise JSONProcessingError(f"Unexpected error: {str(e)}")


def read_json_file(
    filename: str, directory: str = "tmp", key_path: Optional[str] = None
) -> Any:
    """
    Read JSON data from a file in the specified directory and process it.

    :param filename: Name of the file to read
    :param directory: Directory to read from ('tmp' or 'data'). Defaults to 'tmp'
    :param key_path: Dot-separated string indicating the path to the desired data
    :return: Processed JSON data
    """
    try:
        json_data = get_file(filename, directory)
        return process_json_data(json_data, key_path)
    except FileNotFoundError:
        logger.info(f"File {filename} not in {directory} directory")
        return None
    except JSONProcessingError as e:
        logger.info(f"Error processing JSON file: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error reading JSON file: {str(e)}")
        return None


def write_json_file(
    data: Union[Dict, List], filename: str, directory: str = "tmp"
) -> bool:
    """
    Write JSON data to a file in the specified directory.

    :param data: Data to write (must be JSON serializable)
    :param filename: Name of the file to write
    :param directory: Directory to write to ('tmp' or 'data'). Defaults to 'tmp'
    :return: True if write was successful, False otherwise
    """
    try:
        json_data = json.dumps(data, indent=2)
        write_to_file(json_data, filename, directory)
        logger.info(
            f"Successfully wrote JSON data to {filename} in {directory} directory"
        )
        return True
    except Exception as e:
        logger.error(f"Error writing JSON data to file: {str(e)}")
        return False
