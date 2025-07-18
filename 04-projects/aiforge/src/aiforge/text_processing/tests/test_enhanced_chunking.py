# tests/test_enhanced_chunking.py

import pytest

from aiforge.config import config
from aiforge.text_processing.enhanced_chunking import (chunk_text,
                                                       read_file_in_chunks)


@pytest.fixture(scope="session", autouse=True)
def setup_test_files():
    # Create sample text files in the tmp directory
    (config.tmp_dir / "file1.txt").write_text(
        "This is the content of file 1. It has multiple sentences. Testing chunking."
    )
    (config.tmp_dir / "file2.txt").write_text(
        "File 2 content here. Another sentence for testing. And one more."
    )

    yield  # This is where the testing happens

    # No cleanup is performed after the tests


def test_read_file_in_chunks():
    test_file = config.tmp_dir / "file1.txt"
    chunks = list(read_file_in_chunks(test_file, chunk_size=20))
    full_content = "".join(chunks)
    assert full_content == test_file.read_text()


def test_chunk_text():
    text = "This is a test sentence for chunking text into smaller pieces."
    chunks = chunk_text(text, chunk_size=5, overlap=2)
    assert len(chunks) == 4
    assert chunks[0] == "This is a test sentence"
    assert chunks[1] == "test sentence for chunking text"
    assert chunks[2] == "chunking text into smaller pieces."
    assert chunks[3] == "smaller pieces."
