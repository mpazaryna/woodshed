import streamlit as st
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

chat = ChatGroq(temperature=0, model_name="llama3-8b-8192")

def generate_haiku(topic):

    system = "You are poet and able to write the most beautiful haiku on any subject."
    human = "{text}"
    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])

    chain = prompt | chat | StrOutputParser()
    output = chain.invoke({"text": topic})
    st.write(output)

def generate_limerick(topic):

    system = "You are a poet able to writh the most beautiful limerick on any subject."
    human = "{text}"
    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])

    chain = prompt | chat | StrOutputParser()
    output = chain.invoke({"text": topic})
    st.write(output)



def main():
    st.title("Poetry Bot")
    topic = st.text_input("Enter a topic for your haiku:")

    if st.button("Generate Haiku"):
        generate_haiku(topic)
    
    if st.button("Generate Limerick"):
        generate_limerick(topic)



if __name__ == "__main__":
    main()
