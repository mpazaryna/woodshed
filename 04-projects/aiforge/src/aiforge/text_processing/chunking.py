import json
from typing import List

from aiforge.config import config


def chunk_text(file_name: str, chunk_size: int = 1000) -> List[str]:
    """
    Chunk text from a file in the data directory into segments of specified size.

    Args:
    file_name (str): Name of the file in the data directory
    chunk_size (int): Size of each chunk in characters

    Returns:
    List[str]: List of text chunks
    """
    file_path = config.data_dir / file_name
    if not file_path.exists():
        raise FileNotFoundError(f"File {file_name} not in data directory")

    chunks = []
    with open(file_path, "r") as file:
        text = file.read()
        for i in range(0, len(text), chunk_size):
            chunks.append(text[i : i + chunk_size])
    return chunks


def save_chunks_to_json(chunks: List[str], output_file: str) -> None:
    """
    Save text chunks to a JSON file in the tmp directory.

    Args:
    chunks (List[str]): List of text chunks
    output_file (str): Name of the output JSON file
    """
    file_path = config.tmp_dir / output_file
    with open(file_path, "w") as f:
        json.dump({"chunks": chunks}, f)
