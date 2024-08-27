"""
This module provides a Streamlit-based web application for chatting with PDF documents.

It uses the pdf_chat module to process PDF files and answer questions about their content.

Usage:
Run this script using streamlit to start the web application:
    streamlit run st_pdf_chat.py
"""

import streamlit as st
from pdf_chat import answer_question, process_pdf


def sidebar_content():
    """
    Create the content for the sidebar.

    This function sets up the sidebar with a summary of the application
    and information about how it was created.
    """
    st.sidebar.title("About this app")
    st.sidebar.markdown(
        """
        This application allows you to chat with your PDF documents using AI. 
        Simply upload a PDF, and you can ask questions about its content. 
        The app uses OpenAI's language models and embeddings to process the 
        text and generate relevant answers. It was built using Streamlit, 
        LangChain, and FAISS for efficient similarity search.
        """
    )


def main():
    """
    The main function that runs the Streamlit application.

    This function sets up the user interface, handles PDF upload,
    processes user queries, and displays the generated answers.
    """
    st.title("Chat with PDF")

    # Add sidebar content
    sidebar_content()

    uploaded_file = st.file_uploader("Choose a PDF file", type="pdf")

    if uploaded_file is not None:
        knowledge_base = process_pdf(uploaded_file.read())

        if knowledge_base:
            st.success(
                "PDF processed successfully. You can now ask questions about the document."
            )

            query = st.text_input("Enter your question:")
            if st.button("Ask"):
                if query:
                    answer, cost = answer_question(knowledge_base, query)
                    st.write(f"Answer: {answer}")
                    st.write(f"API Usage: {cost}")
                else:
                    st.warning("Please enter a question.")
        else:
            st.error("Failed to process the PDF. Please check the file and try again.")


if __name__ == "__main__":
    main()
