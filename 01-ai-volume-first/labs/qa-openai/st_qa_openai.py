import streamlit as st
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate


def get_llm_response(question):
    """Loads the prompt template, configures OpenAI, and generates a response."""
    template = """Question: {question}

    Answer: Let's think step by step."""

    prompt = PromptTemplate.from_template(template)
    llm = OpenAI(model_name="gpt-3.5-turbo-instruct")
    llm_chain = prompt | llm
    return llm_chain.invoke(question)


st.title("QA App")

question = st.text_input("Enter your question:")

if st.button("Ask!"):
    try:
        response = get_llm_response(question)
        st.success(f"Answer: {response}")
    except Exception as e:
        st.error(f"An error occurred: {e}")
