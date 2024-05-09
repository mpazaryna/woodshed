import streamlit as st
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq


# Define the function within the module
def generate_haiku(topic):

    # Initialize ChatGroq object with desired parameters
    chat = ChatGroq(temperature=0, model_name="llama3-8b-8192")

    system = "You are wise poet and adept at writing the most beautiful haiku to any subject."
    human = "{text}"
    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])

    # Combine prompt and chat groq object into a chain
    chain = prompt | chat | StrOutputParser()
    output = chain.invoke({"text": topic})
    st.write(output)


# Example usage within a Streamlit app (assuming this code is in a separate module)
def main():
    st.title("Haiku Generator")
    topic = st.text_input("Enter a topic for your haiku:")

    if st.button("Generate Haiku"):
        generate_haiku(topic)


if __name__ == "__main__":
    main()
