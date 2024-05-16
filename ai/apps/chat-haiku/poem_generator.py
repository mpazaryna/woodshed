from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

# Initialize the chat model once, to be used by both poem types
chat = ChatGroq(temperature=0, model_name="llama3-8b-8192")

def create_poem(topic, poem_type):
    """
    Generates a poem based on the given topic and type and returns it as a string.
    """
    if poem_type == "haiku":
        system_message = "You are a poet and able to write the most beautiful haiku on any subject."
    elif poem_type == "limerick":
        system_message = "You are a poet able to write the most beautiful limerick on any subject."
    else:
        raise ValueError("Unsupported poem type")

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "{text}")
    ])

    chain = prompt | chat | StrOutputParser()
    output = chain.invoke({"text": topic})
    return output

def generate_poem(topic, poem_type):
    """
    Handles the poem output for different types.
    """
    output = create_poem(topic, poem_type)
    if poem_type == "haiku":
        return output.split('\n')
    else:
        return [output]