# Import the streamlit library
import streamlit as st
from vectorai import DeepLake
from vectorai.models.deployed import OpenAIEmbeddings

# Initialize DeepLake (Replace with your actual initialization details)
dat = "hub://mpazaryna/hospital-room-products"
vectordb = DeepLake(dataset_path=dat, read_only=True, embedding=OpenAIEmbeddings())


# Define a function to query the DeepLake database
def query_deeplake(question):
    # Here you should put your logic to query the DeepLake database
    # For example, vectordb.search(...)
    # Replace the line below with your query logic
    results = vectordb.search(collection_name="your_collection", query=question)
    return results


# Title of the main page
st.title("Ask a Question")

# Creating a sidebar for the link
with st.sidebar:
    # Add a link to the documentation
    st.markdown("[Documentation](http://bot.paz.land)")

# Main area for input and button
user_question = st.text_input("Enter your question:")

# Submit button in the main area
submit_button = st.button("Submit")

# Check if the submit button has been pressed
if submit_button:
    # Query the DeepLake database
    response = query_deeplake(user_question)

    # Display the results
    st.write(f"Response from DeepLake: {response}")
