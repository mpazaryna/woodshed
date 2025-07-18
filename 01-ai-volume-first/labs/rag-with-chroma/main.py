"""
This module provides a pipeline for processing documents using a retrieval-based
question-answering system. It loads documents, splits them into chunks, creates
a vector database, and retrieves answers to queries using a language model.

Usage: from the project root, run `python labs/rag-with-chroma/main.py`
"""

from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_openai import OpenAI, OpenAIEmbeddings


def load_documents(path):
    """
    Load text documents from a specified directory.

    Args:
        path (str): The path to the directory containing text files.

    Returns:
        list: A list of loaded documents.
    """
    loader = DirectoryLoader(path, glob="./*.txt", loader_cls=TextLoader)
    return loader.load()


def split_documents(documents):
    """
    Split documents into smaller chunks for processing.

    Args:
        documents (list): A list of documents to be split.

    Returns:
        list: A list of document chunks.
    """
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    return text_splitter.split_documents(documents)


def create_vector_db(text, embedding, persist_directory="db"):
    """
    Create a vector database from text documents using embeddings.

    Args:
        text (list): A list of text documents.
        embedding: An embedding function to convert text into vectors.
        persist_directory (str): Directory to persist the vector database.

    Returns:
        Chroma: A vector database object.
    """
    vectordb = Chroma.from_documents(documents=text, embedding=embedding)
    # Check if persistence is supported and handle accordingly
    # vectordb.persist()  # Remove or replace this line if persistence is not supported
    return vectordb


def load_vector_db(embedding, persist_directory="db"):
    """
    Load a vector database using the specified embedding function.

    Args:
        embedding: An embedding function to convert text into vectors.
        persist_directory (str): Directory where the vector database is stored.

    Returns:
        Chroma: A vector database object.
    """
    return Chroma(embedding_function=embedding)


def create_retriever(vectordb, k=2):
    """
    Create a retriever from the vector database.

    Args:
        vectordb (Chroma): A vector database object.
        k (int): The number of top results to retrieve.

    Returns:
        Retriever: A retriever object for querying the vector database.
    """
    return vectordb.as_retriever(search_kwargs={"k": k})


def create_qa_chain(retriever):
    """
    Create a question-answering chain using a language model and retriever.

    Args:
        retriever: A retriever object for querying the vector database.

    Returns:
        RetrievalQA: A question-answering chain object.
    """
    llm = OpenAI()
    return RetrievalQA.from_chain_type(
        llm=llm, chain_type="stuff", retriever=retriever, return_source_documents=True
    )


def process_llm_response(llm_response):
    """
    Process and print the response from the language model.

    Args:
        llm_response (dict): The response from the language model containing
                             the result and source documents.
    """
    print(llm_response["result"])
    print("\n\nSources:")
    for source in llm_response["source_documents"]:
        print(source.metadata["source"])


def pipeline(articles_path, query):
    """
    Execute the document processing and question-answering pipeline.

    Args:
        lightning_path (str): The path to the directory containing text files.
        query (str): The query to be answered by the language model.
    """
    documents = load_documents(articles_path)
    text = split_documents(documents)

    embedding = OpenAIEmbeddings()
    vectordb = create_vector_db(text, embedding)
    vectordb = load_vector_db(embedding)

    retriever = create_retriever(vectordb)
    qa_chain = create_qa_chain(retriever)

    llm_response = qa_chain.invoke(query)
    process_llm_response(llm_response)


def main():
    """
    Main function to execute the pipeline with predefined parameters.
    """
    articles_path = "data/input/articles"
    query = "How much money did Microsoft raise?"
    pipeline(articles_path, query)


if __name__ == "__main__":
    main()
