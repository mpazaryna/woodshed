"""
main.py
Document Retrieval System using Haystack with testable structure
"""

import warnings
from pathlib import Path
from typing import Any, Dict, List

from haystack import Pipeline
from haystack.components.converters.txt import TextFileToDocument
from haystack.components.embedders import OpenAIDocumentEmbedder, OpenAITextEmbedder
from haystack.components.preprocessors.document_splitter import DocumentSplitter
from haystack.components.retrievers.in_memory import InMemoryEmbeddingRetriever
from haystack.components.writers import DocumentWriter
from haystack.dataclasses import Document
from haystack.document_stores.in_memory import InMemoryDocumentStore

warnings.filterwarnings("ignore")


class DocumentRetrieval:
    def __init__(self):
        self.document_store = InMemoryDocumentStore()
        self.indexing_pipeline = None
        self.search_pipeline = None
        self._setup_pipelines()

    def _setup_pipelines(self):
        # Setup indexing pipeline
        converter = TextFileToDocument()
        splitter = DocumentSplitter()
        embedder = OpenAIDocumentEmbedder()
        writer = DocumentWriter(document_store=self.document_store)

        self.indexing_pipeline = Pipeline()
        self.indexing_pipeline.add_component("converter", converter)
        self.indexing_pipeline.add_component("splitter", splitter)
        self.indexing_pipeline.add_component("embedder", embedder)
        self.indexing_pipeline.add_component("writer", writer)

        self.indexing_pipeline.connect("converter", "splitter")
        self.indexing_pipeline.connect("splitter", "embedder")
        self.indexing_pipeline.connect("embedder", "writer")

        # Setup search pipeline
        query_embedder = OpenAITextEmbedder()
        retriever = InMemoryEmbeddingRetriever(document_store=self.document_store)

        self.search_pipeline = Pipeline()
        self.search_pipeline.add_component("query_embedder", query_embedder)
        self.search_pipeline.add_component("retriever", retriever)
        self.search_pipeline.connect(
            "query_embedder.embedding", "retriever.query_embedding"
        )

    def index_documents(self, file_paths: List[str]) -> Dict[str, Any]:
        """Index documents from provided file paths."""
        return self.indexing_pipeline.run({"converter": {"sources": file_paths}})

    def search(self, query: str, top_k: int = 3) -> List[Document]:
        """Search for documents matching the query."""
        results = self.search_pipeline.run(
            {"query_embedder": {"text": query}, "retriever": {"top_k": top_k}}
        )
        return results["retriever"]["documents"]

    def get_document_count(self) -> int:
        """Get total number of documents in store."""
        return len(self.document_store.filter_documents())


def print_search_results(documents: List[Document]) -> None:
    """Print search results in a formatted way."""
    for i, document in enumerate(documents):
        print("\n--------------\n")
        print(f"DOCUMENT {i}")
        print(document.content)


def main():
    # Initialize retrieval system
    retrieval = DocumentRetrieval()

    # Index documents
    data_path = Path("data/davinci.txt")
    if not data_path.exists():
        print(f"Error: Data file not found at {data_path}")
        return

    print("Indexing documents...")
    index_results = retrieval.index_documents([str(data_path)])
    print(f"Indexed {index_results['writer']['documents_written']} documents")

    # Search
    question = "How old was Davinci when he died?"
    print(f"\nSearching for: {question}")
    documents = retrieval.search(question)
    print_search_results(documents)


if __name__ == "__main__":
    main()
