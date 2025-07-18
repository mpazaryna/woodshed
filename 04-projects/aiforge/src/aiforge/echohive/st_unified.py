import os
from datetime import datetime

import streamlit as st

from aiforge.echohive.unified import UnifiedApis

# Set page configuration
st.set_page_config(page_title="UnifiedApis LLM Interface", layout="wide")

# Sidebar
st.sidebar.title("LLM Selection")
llm_type = st.sidebar.selectbox(
    "Choose an LLM provider:", ["OpenAI", "Anthropic", "OpenRouter"]
)


# Initialize UnifiedApis
@st.cache_resource
def get_unified_api(provider):
    api_key = os.environ.get(f"{provider.upper()}_API_KEY")
    if not api_key:
        raise ValueError(f"API key for {provider} not found in environment variables")
    return UnifiedApis(provider=provider.lower(), api_key=api_key)


unified_api = get_unified_api(llm_type)

# Main content
st.title("UnifiedApis LLM Interface")

st.markdown(
    """
## Project Description

This Streamlit app demonstrates the capabilities of the UnifiedApis class, which provides a unified interface for interacting with various Language Model providers such as OpenAI, Anthropic, and OpenRouter.

Key features of UnifiedApis:
- Supports multiple LLM providers
- Handles both synchronous and asynchronous operations
- Manages conversation history
- Supports streaming responses
- Implements retry logic for API calls

Use the dropdown in the sidebar to select different LLM providers and explore their capabilities.
"""
)

# Input box and button for asking questions
user_input = st.text_input("Ask a question:")
if st.button("Submit"):
    if user_input:
        with st.spinner("Generating response..."):
            response = unified_api.chat(user_input, should_print=False)
        st.write("Response:")
        st.write(response)
    else:
        st.warning("Please enter a question.")

# Footer
footer = st.container()
with footer:
    st.markdown("---")
    st.markdown(f"© {datetime.now().year} UnifiedApis Project. All rights reserved.")
