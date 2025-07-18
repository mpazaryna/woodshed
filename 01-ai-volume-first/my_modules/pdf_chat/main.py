"""
This module provides functionality for chatting with PDF documents.

It includes functions for processing PDF files, creating knowledge bases,
and answering questions based on the content of the PDFs using OpenAI's
language models and embeddings.

Key features:
- PDF text extraction
- Text processing and embedding
- Question-answering using OpenAI's language models

Dependencies:
- langchain
- pypdf
- faiss
- openai

Type hinting:
This module uses type hints to improve code readability and maintainability.
- Optional: Indicates that a value can be of a specified type or None.
- Tuple: Represents a fixed-size collection of elements.
- Union: Indicates that a value can be one of several types.

For example, `Union[str, bytes]` means a value can be either a string or bytes.
"""

import io
import os
from contextlib import (
    contextmanager,  # Import contextmanager for creating custom context managers
)
from typing import Optional, Tuple, Union

import langchain
from dotenv import load_dotenv
from langchain.chains.question_answering import load_qa_chain
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.callbacks.manager import get_openai_callback
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.llms import OpenAI
from langchain_community.vectorstores import FAISS
from pypdf import PdfReader

from .warning_logger import log_warnings

# Constants
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
LOGGER_NAME = "pdf_chat_logger"
LOG_FILE = "logs/pdf_chat_warnings.log"

# Configuration
langchain.verbose = False
load_dotenv()


def get_openai_api_key() -> str:
    """
    Retrieve the OpenAI API key from environment variables.

    Returns:
        str: The OpenAI API key if found, otherwise an empty string.
    """
    return os.environ.get("OPENAI_API_KEY", "")


def create_text_splitter() -> CharacterTextSplitter:
    """
    Create and configure a CharacterTextSplitter instance.

    Returns:
        CharacterTextSplitter: Configured text splitter for chunking documents.
    """
    return CharacterTextSplitter(
        separator="\n",
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
    )


@log_warnings(logger_name=LOGGER_NAME, log_file=LOG_FILE)
def process_text(text: str) -> Optional[FAISS]:
    """
    Process the input text by splitting it into chunks and creating a FAISS index.

    Args:
        text (str): The input text to process.

    Returns:
        Optional[FAISS]: A FAISS index of the processed text, or None if processing fails.
    """
    if not text.strip():
        return None

    text_splitter = create_text_splitter()
    chunks = text_splitter.split_text(text)

    if not chunks:
        return None

    embeddings = OpenAIEmbeddings(openai_api_key=get_openai_api_key())
    return FAISS.from_texts(chunks, embeddings)


def extract_text_from_pdf(pdf_reader: PdfReader) -> str:
    """
    Extract text content from a PDF file.

    Args:
        pdf_reader (PdfReader): A PdfReader instance of the PDF file.

    Returns:
        str: The extracted text content from all pages of the PDF.
    """
    return "".join(page.extract_text() for page in pdf_reader.pages)


@contextmanager
def open_pdf_file(pdf_file: Union[str, bytes]):
    """
    Context manager for opening a PDF file.

    Args:
        pdf_file (Union[str, bytes]): Either a file path (str) or file content (bytes) of the PDF.

    Yields:
        PdfReader: A PdfReader instance of the opened PDF file.
    """
    try:
        # If pdf_file is a string, open it as a file; otherwise, treat it as bytes
        if isinstance(pdf_file, str):
            pdf_reader = PdfReader(pdf_file)
        else:
            pdf_reader = PdfReader(io.BytesIO(pdf_file))
        yield pdf_reader  # Yield the PdfReader instance for use in the block
    finally:
        # No explicit close needed for PdfReader, but this is where you could handle cleanup if necessary
        pass


def process_pdf(pdf_file: Union[str, bytes]) -> Optional[FAISS]:
    """
    Process a PDF file by extracting its text and creating a FAISS index.

    Args:
        pdf_file (Union[str, bytes]): Either a file path (str) or file content (bytes) of the PDF.

    Returns:
        Optional[FAISS]: A FAISS index of the processed PDF content, or None if processing fails.
    """
    try:
        # Use the context manager to handle the opening of the PDF file
        with open_pdf_file(pdf_file) as pdf_reader:
            text = extract_text_from_pdf(pdf_reader)  # Extract text from the opened PDF
            return process_text(text)  # Process the extracted text into a FAISS index
    except Exception as e:
        log_warnings(f"Error processing PDF: {e}")  # Log the error instead of printing
        return None  # Return None if processing fails


def answer_question(knowledge_base: FAISS, query: str) -> Tuple[str, dict]:
    """
    Generate an answer to a question based on the provided knowledge base.

    Args:
        knowledge_base (FAISS): The FAISS index containing the document embeddings.
        query (str): The question to answer.

    Returns:
        Tuple[str, dict]: A tuple containing the generated answer and the OpenAI API usage information.
    """
    docs = knowledge_base.similarity_search(query)
    llm = OpenAI(openai_api_key=get_openai_api_key())
    chain = load_qa_chain(llm, chain_type="stuff")

    with get_openai_callback() as cost:
        response = chain.invoke(input={"question": query, "input_documents": docs})
    return response["output_text"], cost
