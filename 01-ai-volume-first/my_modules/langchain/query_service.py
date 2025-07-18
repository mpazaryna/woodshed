from langchain.chains import RetrievalQA
from langchain_openai import OpenAI


def create_qa_chain(vectordb):
    retriever = vectordb.as_retriever(search_kwargs={"k": 2})
    return RetrievalQA.from_chain_type(
        llm=OpenAI(),
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
    )


def process_query(qa_chain, query):
    llm_response = qa_chain(query)
    result = llm_response["result"]
    sources = [source.metadata["source"] for source in llm_response["source_documents"]]
    return result, sources
