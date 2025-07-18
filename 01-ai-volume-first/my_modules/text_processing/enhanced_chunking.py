# src/aiforge/vectorstore/enhanced_chunking.py

import json
import logging
import os
import sys
from pathlib import Path
from typing import Dict, Iterator, List

# Set up logging
log_dir = Path("/Users/mpaz/workspace/woodshed-ai/logs")
log_dir.mkdir(parents=True, exist_ok=True)  # Create logs directory if it doesn't exist

logging.basicConfig(
    filename=log_dir / "chunking.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


class Config:
    def __init__(self):
        self.data_dir = Path("/Users/mpaz/workspace/woodshed-ai/data/input/articles")
        self.tmp_dir = Path("/Users/mpaz/workspace/woodshed-ai/data/output")
        self.output_file = self.tmp_dir / "chunked_files.json"


def read_file_in_chunks(file_path: Path, chunk_size: int = 1024) -> Iterator[str]:
    """
    Read a file in chunks to optimize memory usage.

    Args:
        file_path (Path): Path to the file to be read.
        chunk_size (int): Size of each chunk in bytes.

    Yields:
        str: Chunks of the file content.

    Raises:
        FileNotFoundError: If the specified file does not exist.
        IOError: If there's an error reading the file.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            while True:
                chunk = file.read(chunk_size)
                if not chunk:
                    break
                yield chunk
    except FileNotFoundError:
        raise FileNotFoundError(f"File not found: {file_path}")
    except IOError as e:
        raise IOError(f"Error reading file {file_path}: {str(e)}")


def chunk_text(text: str, chunk_size: int, overlap: int) -> List[str]:
    """
    Split text into chunks of words with specified overlap.

    Args:
        text (str): The input text to be chunked.
        chunk_size (int): The number of words in each chunk.
        overlap (int): The number of words to overlap between chunks.

    Returns:
        List[str]: A list of text chunks.

    Raises:
        ValueError: If chunk_size or overlap is less than 1.
    """
    if chunk_size < 1 or overlap < 1:
        raise ValueError("chunk_size and overlap must be at least 1")

    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start : min(end, len(words))])
        chunks.append(chunk)
        start += chunk_size - overlap

    return chunks


def process_file(
    file_path: Path, chunk_size: int, overlap: int
) -> Dict[str, List[str]]:
    """
    Process a single file by reading it in chunks and then splitting into overlapping word chunks.

    Args:
        file_path (Path): Path to the file to be processed.
        chunk_size (int): The number of words in each chunk.
        overlap (int): The number of words to overlap between chunks.

    Returns:
        Dict[str, List[str]]: A dictionary with the filename as key and list of chunks as value.

    Raises:
        FileNotFoundError: If the specified file does not exist.
        IOError: If there's an error reading the file.
    """
    try:
        text = "".join(read_file_in_chunks(file_path))
        chunks = chunk_text(text, chunk_size, overlap)
        return {file_path.name: chunks}
    except (FileNotFoundError, IOError) as e:
        logging.error(f"Error processing file {file_path}: {str(e)}")
        return {}


def process_directory(
    directory: Path, chunk_size: int, overlap: int
) -> Dict[str, List[str]]:
    """
    Process all text files in the given directory.

    Args:
        directory (Path): Path to the directory containing text files.
        chunk_size (int): The number of words in each chunk.
        overlap (int): The number of words to overlap between chunks.

    Returns:
        Dict[str, List[str]]: A dictionary with filenames as keys and lists of chunks as values.

    Raises:
        NotADirectoryError: If the specified path is not a directory.
    """
    if not directory.is_dir():
        raise NotADirectoryError(f"{directory} is not a valid directory")

    all_chunks = {}
    for file_path in directory.glob("*.txt"):
        all_chunks.update(process_file(file_path, chunk_size, overlap))
    return all_chunks


def save_chunks_to_json(chunks: Dict[str, List[str]], output_file: Path) -> None:
    """
    Save the chunked data to a JSON file.

    Args:
        chunks (Dict[str, List[str]]): A dictionary with filenames as keys and lists of chunks as values.
        output_file (Path): Path where the JSON file will be saved.

    Raises:
        IOError: If there's an error writing to the file.
    """
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(chunks, f, ensure_ascii=False, indent=2)
    except IOError as e:
        raise IOError(f"Error writing to file {output_file}: {str(e)}")


if __name__ == "__main__":
    chunk_size = 1000
    overlap = 200

    # Initialize the config without parameters
    config = Config()

    try:
        all_chunks = process_directory(config.data_dir, chunk_size, overlap)
        save_chunks_to_json(all_chunks, config.output_file)
        logging.info(f"Chunked files have been saved to {config.output_file}")
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
