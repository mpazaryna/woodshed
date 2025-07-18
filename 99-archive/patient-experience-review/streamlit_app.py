# Import the streamlit library
import streamlit as st

# Title of the main page
st.title("Ask a Question")

# Creating a sidebar for the link
with st.sidebar:
    # Add a link to the documentation
    st.markdown("[Documentation](http://bot.paz.land)")

# Main area for input and button
# Text input box in the main area
user_question = st.text_input("Enter your question:")

# Submit button in the main area
submit_button = st.button("Submit")

# Check if the submit button has been pressed
if submit_button:
    # Display the user's question on the main page
    st.write(f"Your question was: {user_question}")
