"""
error_utils.py

This module provides utility functions for handling errors in a Streamlit application.
"""

import streamlit as st


def handle_error(error: Exception, context: str = ""):
    """
    Display an error message in Streamlit with optional context.

    Parameters:
    - error (Exception): The exception that was raised.
    - context (str): Additional context about where the error occurred.
    """
    error_message = f"Error occurred: {str(error)}"
    if context:
        error_message = f"{context} - {error_message}"
    st.error(error_message, icon="🚨")
    # Optionally, log the error to a file or external service here
