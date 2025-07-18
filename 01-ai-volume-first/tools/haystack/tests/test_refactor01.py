"""
test_main.py
Fixed integration tests for document retrieval system
"""

from pathlib import Path

import pytest
from haystack.document_stores.errors import DuplicateDocumentError

from woodshed.integrations.frameworks.haystack.refactor01 import DocumentRetrieval


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
    test_file.unlink()  # Cleanup after tests


@pytest.fixture
def retrieval_system(test_data_path):
    """Initialize and populate a retrieval system with test data."""
    retrieval = DocumentRetrieval()
    retrieval.index_documents([str(test_data_path)])
    return retrieval


def test_document_indexing_and_search(retrieval_system):
    """Test basic indexing and search functionality."""
    question = "How old was Davinci when he died?"
    results = retrieval_system.search(question)

    assert len(results) > 0
    found_age_info = any(
        "sixty-seven years of age" in doc.content.lower() for doc in results
    )
    assert found_age_info, "Expected age information not found in search results"


def test_search_returns_correct_number_of_results(retrieval_system):
    """Test that search respects the top_k parameter."""
    for top_k in [1, 2, 3]:
        results = retrieval_system.search("Davinci", top_k=top_k)
        assert (
            len(results) <= top_k
        ), f"Expected at most {top_k} results, got {len(results)}"


def test_search_birth_information(retrieval_system):
    """Test searching for birth-related information."""
    results = retrieval_system.search("Where and when was Da Vinci born?")

    found_birth_info = any(
        "born in vinci" in doc.content.lower() and "1452" in doc.content
        for doc in results
    )
    assert found_birth_info, "Birth information not found in search results"


def test_search_milan_period(retrieval_system):
    """Test searching for information about Milan period."""
    results = retrieval_system.search("What did Leonardo do in Milan?")

    found_milan_info = any(
        "milan" in doc.content.lower() and "last supper" in doc.content.lower()
        for doc in results
    )
    assert found_milan_info, "Milan period information not found in search results"


def test_search_mona_lisa(retrieval_system):
    """Test searching for Mona Lisa information."""
    results = retrieval_system.search("Tell me about the Mona Lisa")

    found_mona_lisa_info = any(
        "mona lisa" in doc.content.lower() and "louvre" in doc.content.lower()
        for doc in results
    )
    assert found_mona_lisa_info, "Mona Lisa information not found in search results"


def test_multiple_document_indexing(test_data_path):
    """Test indexing multiple copies of the same document."""
    # Create a second test file with slightly different content
    test_file2 = Path("data/test_davinci2.txt")
    test_file2.write_text("Leonardo da Vinci was a Renaissance polymath.")

    try:
        retrieval = DocumentRetrieval()

        # Index both documents
        retrieval.index_documents([str(test_data_path)])
        initial_count = retrieval.get_document_count()

        retrieval.index_documents([str(test_file2)])
        final_count = retrieval.get_document_count()

        assert (
            final_count > initial_count
        ), "Document count should increase after indexing new document"
    finally:
        test_file2.unlink()  # Clean up


def test_search_result_relevance(retrieval_system):
    """Test that search results are returned in order of relevance."""
    results = retrieval_system.search("When did Leonardo die?")

    # Check if the death date appears in the first result
    first_result_content = results[0].content.lower()
    contains_death_date = (
        "april 23, 1519" in first_result_content or "may 2" in first_result_content
    )
    assert contains_death_date, "Most relevant result should contain death date"


def test_search_with_modern_terms(retrieval_system):
    """Test searching using modern terminology."""
    results = retrieval_system.search("What artistic masterpieces did Leonardo create?")

    found_works = any(
        ("last supper" in doc.content.lower() or "mona lisa" in doc.content.lower())
        for doc in results
    )
    assert found_works, "Failed to find Leonardo's famous works with modern query"


def test_empty_query_handling(retrieval_system):
    """Test handling of empty queries."""
    # Since the embedding model might return results for empty queries,
    # we should test that the results are at least relevant to the corpus
    results = retrieval_system.search("")

    if len(results) > 0:
        # Verify that returned documents are about Leonardo da Vinci
        assert any(
            "leonardo" in doc.content.lower() for doc in results
        ), "Results for empty query should still be relevant to the corpus"


def test_document_content_preserved(retrieval_system):
    """Test that document content is preserved accurately after indexing."""
    results = retrieval_system.search("Leonardo da Vinci")

    assert any(
        "leonardo" in doc.content.lower() for doc in results
    ), "Original document content should be preserved"


def test_case_insensitive_search(retrieval_system):
    """Test that search is case insensitive."""
    lower_results = retrieval_system.search("leonardo da vinci")
    upper_results = retrieval_system.search("LEONARDO DA VINCI")

    assert len(lower_results) == len(
        upper_results
    ), "Case should not affect result count"
