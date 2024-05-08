"""
Note: There is an issue when running this script in Streamlit;
      it can't find `langchain_experimental`. This may require 
      additional debugging or ensuring the module is correctly 
      installed and accessible in your environment.
      
      The same code runs as expected in a cli environment
      and in the notebook.ipynb file.
"""

import os

import pandas as pd
import streamlit as st
from dotenv import load_dotenv
from langchain_experimental.agents import create_csv_agent
from langchain_openai import OpenAI


def main():
    load_dotenv()

    # Load the OpenAI API key from the environment variable
    if os.getenv("OPENAI_API_KEY") is None or os.getenv("OPENAI_API_KEY") == "":
        print("OPENAI_API_KEY is not set")
        exit(1)
    else:
        print("OPENAI_API_KEY is set")

    st.set_page_config(page_title="Ask your CSV")
    st.header("Ask your CSV")

    csv_file = st.file_uploader("Upload a CSV file", type="csv")
    if csv_file is not None:

        agent = create_csv_agent(OpenAI(temperature=0), csv_file, verbose=True)
        user_question = st.text_input("Ask a question about your CSV: ")

        if user_question is not None and user_question != "":
            with st.spinner(text="In progress..."):
                st.write(agent.run(user_question))


if __name__ == "__main__":
    main()
