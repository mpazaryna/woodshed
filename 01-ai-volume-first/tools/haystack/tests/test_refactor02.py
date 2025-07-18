"""
test_main.py
Integration tests for functional document retrieval system
"""

from pathlib import Path

import pytest

from woodshed.integrations.frameworks.haystack.refactor02 import (
    get_document_count,
    index_documents,
    initialize_pipelines,
    search_documents,
)


@pytest.fixture
def test_data_path():
    """Create a test file with known content about Da Vinci."""
    test_file = Path("data/test_davinci.txt")
    test_file.parent.mkdir(exist_ok=True)

    test_content = """
    Leonardo da Vinci made his will on April 23, 1519, and passed away on May 2
    of the same year. The not over-veracious chronicler claimed he was in his
    seventy-fifth year, but Leonardo was only sixty-seven years of age when he died.

    Leonardo was born in Vinci, a town near Florence, Italy in 1452. His father
    was Ser Piero, a notary, and his mother was Caterina, a peasant woman.

    During his time in Milan (1482-1499), Leonardo worked on many projects including
    the famous Last Supper mural. He also spent time in Rome from 1513 to 1515, where
    he worked on various scientific studies.

    The Mona Lisa, perhaps his most famous work, was painted between 1503 and 1519.
    It now resides in the Louvre Museum in Paris, France.
    """

    test_file.write_text(test_content)
    yield test_file
    test_file.unlink()


@pytest.fixture
def initialized_system(test_data_path):
    """Initialize and populate the retrieval system with test data."""
    document_store, indexing_pipeline, search_pipeline = initialize_pipelines()
    index_documents(indexing_pipeline, [str(test_data_path)])
    return document_store, indexing_pipeline, search_pipeline


def test_document_indexing_and_search(initialized_system):
    """Test basic indexing and search functionality."""
    _, _, search_pipeline = initialized_system

    question = "How old was Davinci when he died?"
    results = search_documents(search_pipeline, question)

    assert len(results) > 0
    found_age_info = any(
        "sixty-seven years of age" in doc.content.lower() for doc in results
    )
    assert found_age_info, "Expected age information not found in search results"


def test_search_returns_correct_number_of_results(initialized_system):
    """Test that search respects the top_k parameter."""
    _, _, search_pipeline = initialized_system

    for top_k in [1, 2, 3]:
        # Changed from question="Davinci" to query="Davinci"
        results = search_documents(search_pipeline, query="Davinci", top_k=top_k)
        assert (
            len(results) <= top_k
        ), f"Expected at most {top_k} results, got {len(results)}"


def test_multiple_document_indexing(test_data_path):
    """Test indexing multiple documents."""
    # Create a second test file with different content
    test_file2 = Path("data/test_davinci2.txt")
    test_file2.write_text("Leonardo da Vinci was a Renaissance polymath.")

    try:
        document_store, indexing_pipeline, _ = initialize_pipelines()

        # Index first document
        index_documents(indexing_pipeline, [str(test_data_path)])
        initial_count = get_document_count(document_store)

        # Index second document
        index_documents(indexing_pipeline, [str(test_file2)])
        final_count = get_document_count(document_store)

        assert (
            final_count > initial_count
        ), "Document count should increase after indexing new document"
    finally:
        test_file2.unlink()


def test_search_result_relevance(initialized_system):
    """Test that search results are returned in order of relevance."""
    _, _, search_pipeline = initialized_system

    results = search_documents(search_pipeline, "When did Leonardo die?")

    first_result_content = results[0].content.lower()
    contains_death_date = (
        "april 23, 1519" in first_result_content or "may 2" in first_result_content
    )
    assert contains_death_date, "Most relevant result should contain death date"


def test_search_birth_information(initialized_system):
    """Test searching for birth-related information."""
    _, _, search_pipeline = initialized_system

    results = search_documents(search_pipeline, "Where and when was Da Vinci born?")

    found_birth_info = any(
        "born in vinci" in doc.content.lower() and "1452" in doc.content
        for doc in results
    )
    assert found_birth_info, "Birth information not found in search results"


def test_empty_query_handling(initialized_system):
    """Test handling of empty queries."""
    _, _, search_pipeline = initialized_system

    results = search_documents(search_pipeline, "")

    if len(results) > 0:
        assert any(
            "leonardo" in doc.content.lower() for doc in results
        ), "Results for empty query should still be relevant to the corpus"


def test_document_content_preserved(initialized_system):
    """Test that document content is preserved accurately after indexing."""
    _, _, search_pipeline = initialized_system

    results = search_documents(search_pipeline, "Leonardo da Vinci")

    assert any(
        "leonardo" in doc.content.lower() for doc in results
    ), "Original document content should be preserved"


def test_case_insensitive_search(initialized_system):
    """Test that search is case insensitive."""
    _, _, search_pipeline = initialized_system

    lower_results = search_documents(search_pipeline, "leonardo da vinci")
    upper_results = search_documents(search_pipeline, "LEONARDO DA VINCI")

    assert len(lower_results) == len(
        upper_results
    ), "Case should not affect result count"
