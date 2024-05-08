import streamlit as st

# Define the function within the module
def generate_haiku(topic):
  from langchain_core.prompts import ChatPromptTemplate
  from langchain_groq import ChatGroq

  # Initialize ChatGroq object with desired parameters
  chat = ChatGroq(temperature=0, model_name="llama3-8b-8192")

  # Construct the prompt template
  prompt = ChatPromptTemplate.from_messages([("human", "Write a haiku about " + topic)])

  # Combine prompt and chat groq object into a chain
  chain = prompt | chat
  return chain

# Example usage within a Streamlit app (assuming this code is in a separate module)
def main():
  st.title("Haiku Generator")
  topic = st.text_input("Enter a topic for your haiku:")

  if st.button("Generate Haiku"):
    generate_haiku(topic)

if __name__ == "__main__":
  main()
