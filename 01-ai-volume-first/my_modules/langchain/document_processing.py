from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings


def load_documents(path):
    loader = DirectoryLoader(path, glob="*.txt", loader_cls=TextLoader)
    return loader.load()


def split_text(documents):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    return text_splitter.split_documents(documents)


def create_vectordb(texts, persist_directory):
    embedding = OpenAIEmbeddings()
    persist_directory_str = str(persist_directory)  # Convert PosixPath to string
    vectordb = Chroma.from_documents(
        documents=texts, embedding=embedding, persist_directory=persist_directory_str
    )
    vectordb.persist()
    return vectordb
