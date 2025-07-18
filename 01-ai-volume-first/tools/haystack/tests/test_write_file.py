import re
import shutil
import tempfile
import time
from datetime import datetime
from pathlib import Path

import pytest

from woodshed.integrations.frameworks.haystack.refactor02 import (
    create_markdown_content,
    ensure_output_dir,
    index_documents,
    initialize_pipelines,
    save_session,
    search_documents,
)


def save_session(file_path: str, qa_session: list) -> Path:
    """Save the Q&A session to a markdown file in data/output directory."""
    # Ensure output directory exists
    output_dir = ensure_output_dir()

    # Create timestamped filename with milliseconds
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:19]  # Include milliseconds
    output_file = output_dir / f"qa_session_{timestamp}.md"

    content = create_markdown_content(file_path, qa_session)
    output_file.write_text(content)

    return output_file


@pytest.fixture
def test_output_dir():
    """Create a temporary directory for test outputs."""
    with tempfile.TemporaryDirectory() as tmpdirname:
        yield Path(tmpdirname)


@pytest.fixture
def test_data_file():
    """Create a temporary test data file."""
    content = """
    Leonardo da Vinci made his will on April 23, 1519, and passed away on May 2
    of the same year. The not over-veracious chronicler claimed he was in his
    seventy-fifth year, but Leonardo was only sixty-seven years of age when he died.
    """
    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".txt") as f:
        f.write(content)

    yield Path(f.name)

    # Cleanup
    Path(f.name).unlink()


@pytest.fixture
def mock_qa_session(test_data_file):
    """Initialize system and create a mock Q&A session."""
    # Initialize the system
    document_store, indexing_pipeline, search_pipeline = initialize_pipelines()

    # Index the test document
    index_documents(indexing_pipeline, [str(test_data_file)])

    # Create a sample Q&A session
    questions = ["How old was Da Vinci when he died?", "When did he make his will?"]

    qa_session = []
    for question in questions:
        documents = search_documents(search_pipeline, question)
        qa_session.append((question, documents))

    return qa_session


def test_ensure_output_dir(test_output_dir):
    """Test output directory creation."""
    output_path = test_output_dir / "data" / "output"
    created_path = ensure_output_dir(str(output_path))

    assert created_path.exists()
    assert created_path.is_dir()
    assert str(created_path) == str(output_path)


def test_create_markdown_content(mock_qa_session, test_data_file):
    """Test markdown content creation and structure."""
    content = create_markdown_content(str(test_data_file), mock_qa_session)

    # Verify basic structure
    assert "# Document Q&A Session" in content
    assert f"Source Document: `{test_data_file}`" in content

    # Check date format
    date_pattern = r"Date: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}"
    assert re.search(date_pattern, content)

    # Verify questions and answers
    assert "## Question 1:" in content
    assert "### Answer 1:" in content

    # Verify content includes actual Q&A
    assert "How old was Da Vinci when he died?" in content
    assert "sixty-seven years" in content


def test_save_session(test_output_dir, mock_qa_session, test_data_file):
    """Test saving Q&A session to a file."""
    # Temporarily override the default output directory
    original_output = Path("data/output")
    test_output = test_output_dir / "data" / "output"

    try:
        # Save the session
        output_file = save_session(str(test_data_file), mock_qa_session)

        # Verify file was created and is not empty
        assert output_file.exists()
        assert output_file.is_file()
        assert output_file.stat().st_size > 0

        # Verify file content
        content = output_file.read_text()
        assert "# Document Q&A Session" in content
        assert "## Question 1:" in content
        assert "### Answer 1:" in content

        # Verify filename format with updated pattern to include milliseconds
        assert re.match(
            r"qa_session_\d{8}_\d{6}_\d{3}\.md", output_file.name
        ), f"Filename {output_file.name} doesn't match expected format"

    finally:
        # Cleanup
        if test_output.exists():
            shutil.rmtree(test_output)


def test_full_qa_session_workflow(test_output_dir, test_data_file):
    """Test the entire Q&A session workflow."""
    # Initialize the system
    document_store, indexing_pipeline, search_pipeline = initialize_pipelines()

    # Index the test document
    index_results = index_documents(indexing_pipeline, [str(test_data_file)])
    assert index_results["writer"]["documents_written"] > 0

    # Create a test Q&A session
    qa_session = []
    question = "How old was Da Vinci when he died?"
    documents = search_documents(search_pipeline, question)
    qa_session.append((question, documents))

    # Save the session
    output_file = save_session(str(test_data_file), qa_session)

    # Verify the output
    assert output_file.exists()
    content = output_file.read_text()

    # Check content structure
    assert "# Document Q&A Session" in content
    assert "How old was Da Vinci when he died?" in content
    assert "sixty-seven years" in content


def test_multiple_sessions(test_output_dir, test_data_file, mock_qa_session):
    """Test saving multiple sessions."""
    # Temporarily set output directory
    output_dir = test_output_dir / "data" / "output"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Save two sessions
    output_file1 = save_session(str(test_data_file), mock_qa_session)
    time.sleep(0.001)  # Ensure different milliseconds
    output_file2 = save_session(str(test_data_file), mock_qa_session)

    # Verify different filenames
    assert output_file1 != output_file2, "Files should have unique names"
    assert output_file1.exists(), "First file should exist"
    assert output_file2.exists(), "Second file should exist"

    # Verify content in both files
    content1 = output_file1.read_text()
    content2 = output_file2.read_text()
    assert "# Document Q&A Session" in content1
    assert "# Document Q&A Session" in content2
