"""
main.py
Document Retrieval System using Haystack - Functional Implementation
"""

import time
import warnings
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Tuple

from haystack import Pipeline
from haystack.components.converters.txt import TextFileToDocument
from haystack.components.embedders import OpenAIDocumentEmbedder, OpenAITextEmbedder
from haystack.components.preprocessors.document_splitter import DocumentSplitter
from haystack.components.retrievers.in_memory import InMemoryEmbeddingRetriever
from haystack.components.writers import DocumentWriter
from haystack.dataclasses import Document
from haystack.document_stores.in_memory import InMemoryDocumentStore

warnings.filterwarnings("ignore")


def create_document_store() -> InMemoryDocumentStore:
    """Create and initialize a document store."""
    return InMemoryDocumentStore()


def create_indexing_pipeline(document_store: InMemoryDocumentStore) -> Pipeline:
    """Create pipeline for processing and indexing documents."""
    converter = TextFileToDocument()
    splitter = DocumentSplitter()
    embedder = OpenAIDocumentEmbedder()
    writer = DocumentWriter(document_store=document_store)

    indexing_pipeline = Pipeline()
    indexing_pipeline.add_component("converter", converter)
    indexing_pipeline.add_component("splitter", splitter)
    indexing_pipeline.add_component("embedder", embedder)
    indexing_pipeline.add_component("writer", writer)

    indexing_pipeline.connect("converter", "splitter")
    indexing_pipeline.connect("splitter", "embedder")
    indexing_pipeline.connect("embedder", "writer")

    return indexing_pipeline


def create_search_pipeline(document_store: InMemoryDocumentStore) -> Pipeline:
    """Create pipeline for searching documents."""
    query_embedder = OpenAITextEmbedder()
    retriever = InMemoryEmbeddingRetriever(document_store=document_store)

    search_pipeline = Pipeline()
    search_pipeline.add_component("query_embedder", query_embedder)
    search_pipeline.add_component("retriever", retriever)
    search_pipeline.connect("query_embedder.embedding", "retriever.query_embedding")

    return search_pipeline


def initialize_pipelines() -> Tuple[InMemoryDocumentStore, Pipeline, Pipeline]:
    """Initialize document store and both pipelines."""
    document_store = create_document_store()
    indexing_pipeline = create_indexing_pipeline(document_store)
    search_pipeline = create_search_pipeline(document_store)
    return document_store, indexing_pipeline, search_pipeline


def index_documents(pipeline: Pipeline, file_paths: List[str]) -> Dict[str, Any]:
    """Index documents from provided file paths."""
    return pipeline.run({"converter": {"sources": file_paths}})


def search_documents(pipeline: Pipeline, query: str, top_k: int = 3) -> List[Document]:
    """Search for documents matching the query."""
    results = pipeline.run(
        {"query_embedder": {"text": query}, "retriever": {"top_k": top_k}}
    )
    return results["retriever"]["documents"]


def get_document_count(document_store: InMemoryDocumentStore) -> int:
    """Get total number of documents in store."""
    return len(document_store.filter_documents())


def print_search_results(documents: List[Document]) -> None:
    """Print search results in a formatted way."""
    for i, document in enumerate(documents):
        print("\n--------------\n")
        print(f"DOCUMENT {i}")
        print(document.content)


import time
from datetime import datetime
from pathlib import Path


def ensure_output_dir(base_dir: str = "data/output") -> Path:
    """Create output directory if it doesn't exist."""
    output_dir = Path(base_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir


def create_markdown_content(file_path: str, qa_session: list) -> str:
    """Create formatted markdown content from the Q&A session."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    content = [
        f"# Document Q&A Session",
        f"\nDate: {timestamp}",
        f"\nSource Document: `{file_path}`\n",
    ]

    for i, (question, documents) in enumerate(qa_session, 1):
        content.append(f"\n## Question {i}: {question}\n")
        for j, doc in enumerate(documents, 1):
            content.append(f"\n### Answer {j}:\n")
            content.append(doc.content.strip())

    return "\n".join(content)


def save_session(file_path: str, qa_session: list) -> Path:
    """Save the Q&A session to a markdown file in data/output directory."""
    # Ensure output directory exists
    output_dir = ensure_output_dir()

    # Create timestamped filename
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    output_file = output_dir / f"qa_session_{timestamp}.md"

    content = create_markdown_content(file_path, qa_session)

    output_file.write_text(content)
    return output_file


def main():
    # Initialize system
    document_store, indexing_pipeline, search_pipeline = initialize_pipelines()

    # Get file path from user
    file_path = input("Enter the path to your text file: ").strip()
    data_path = Path(file_path)
    if not data_path.exists():
        print(f"Error: File not found at {file_path}")
        return

    print("Indexing documents...")
    index_results = index_documents(indexing_pipeline, [str(data_path)])
    print(f"Indexed {index_results['writer']['documents_written']} documents")

    # Store questions and answers for the session
    qa_session = []

    # Loop for multiple questions
    while True:
        print("\nEnter your question (or 'quit' to exit)")
        question = input("Question: ").strip()

        if question.lower() in ["quit", "q", "exit"]:
            break

        if not question:
            question = "How old was Davinci when he died?"
            print(f"Using default question: {question}")

        print(f"\nSearching for: {question}")
        documents = search_documents(search_pipeline, question)
        print_search_results(documents)

        # Store the Q&A pair
        qa_session.append((question, documents))

        print("\n" + "=" * 50)  # Visual separator between questions

    # Save session if there were any questions
    if qa_session:
        print("\nSaving session...")
        output_file = save_session(file_path, qa_session)
        print(f"Session saved to: {output_file}")

    print("Goodbye!")


if __name__ == "__main__":
    main()
