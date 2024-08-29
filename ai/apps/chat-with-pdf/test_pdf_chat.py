import os

import pytest
from langchain_community.vectorstores import FAISS
from pdf_chat import process_text  # Changed import from app to pdf_chat
from pypdf import PdfReader
from warning_logger import log_warnings

# Constants
PDF_SAMPLE_PATH = "2403.05568v1.pdf"
TEST_LOGGER_NAME = "test_pdf_chat_logger"  # Changed logger name
TEST_LOG_FILE = "logs/test_pdf_chat_warnings.log"  # Changed log file name


# Fixtures
@pytest.fixture(scope="module")
def openai_api_key():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        pytest.skip("OPENAI_API_KEY not found in environment variables")
    return api_key


# Helper functions
def read_pdf(pdf_path):
    pdf_reader = PdfReader(pdf_path)
    return "".join(page.extract_text() for page in pdf_reader.pages)


# Decorators
def common_test_setup(func):
    return pytest.mark.filterwarnings("ignore::DeprecationWarning")(
        pytest.mark.filterwarnings("ignore::UserWarning")(
            log_warnings(logger_name=TEST_LOGGER_NAME, log_file=TEST_LOG_FILE)(func)
        )
    )


# Test functions
@common_test_setup
def test_process_text(openai_api_key):
    sample_text = """This is a sample text.
    It has multiple lines.
    We will use it to test the process_text function."""

    knowledge_base = process_text(sample_text)

    assert isinstance(knowledge_base, FAISS)

    query = "What is this text about?"
    results = knowledge_base.similarity_search(query)

    assert len(results) > 0
    assert any("sample text" in result.page_content for result in results)


@common_test_setup
def test_process_text_empty_input(openai_api_key):
    empty_text = ""
    knowledge_base = process_text(empty_text)
    assert knowledge_base is None


@common_test_setup
def test_process_text_with_pdf_sample(openai_api_key, capsys):
    text = read_pdf(PDF_SAMPLE_PATH)
    knowledge_base = process_text(text)

    assert isinstance(knowledge_base, FAISS)

    query = "What is the main topic of this document?"
    results = knowledge_base.similarity_search(query)

    print("\nSimilarity search results:", flush=True)
    for i, result in enumerate(results):
        print(f"Result {i + 1}:", flush=True)
        print(result.page_content[:200], flush=True)
        print("---", flush=True)

    captured = capsys.readouterr()
    print(captured.out)

    expected_text = "Mental health challenges"
    assert any(
        expected_text.lower() in result.page_content.lower() for result in results
    ), f"Expected text not found in results: {expected_text}"
