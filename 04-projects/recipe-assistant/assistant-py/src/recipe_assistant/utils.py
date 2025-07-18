"""
This module provides utility functions for the recipe assistant application.

It includes functions for reading files from the data directory, handling both
JSON and non-JSON files. The module is designed to support data loading and
parsing operations within the recipe assistant system.
"""

import json
from pathlib import Path
from typing import Any, Dict, List, Union


def read_file_from_data_directory(filename: str) -> Union[Dict[str, Any], List[Any], str]:
    """
    Read a file from the data directory and return its contents.

    Args:
        filename (str): The name of the file to read.

    Returns:
        Union[Dict[str, Any], List[Any], str]: The contents of the file, parsed as JSON if possible, otherwise as a string.

    Raises:
        FileNotFoundError: If the file doesn't exist.
    """
    data_dir = Path(__file__).resolve().parent.parent.parent / "data"
    file_path = data_dir / filename

    if not file_path.exists():
        raise FileNotFoundError(f"File {filename} not found in the data directory.")

    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    if not content:
        print(f"Warning: {filename} is empty.")
        return {}

    if filename.endswith(".json"):
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            raise json.JSONDecodeError(f"Error parsing {filename}: {str(e)}", e.doc, e.pos)
    else:
        return content  # Return content as a string for non-JSON files (like XML)
