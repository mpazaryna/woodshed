"""
st_test_error.py

This Streamlit application demonstrates error handling by intentionally raising an error
and displaying it using a custom error handling utility.
"""

import streamlit as st
from error_utils import handle_error


def main():
    """
    Main function to run the Streamlit app.

    It sets the title of the app and intentionally raises a ValueError to test error handling.
    """
    st.title("Error Handling Test")

    try:
        # Intentionally raise an error
        raise ValueError("This is a test error")
    except Exception as e:
        handle_error(e, context="Testing error handling")


if __name__ == "__main__":
    main()
