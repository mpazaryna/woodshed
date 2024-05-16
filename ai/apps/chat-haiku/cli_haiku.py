from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

def create_chat_groq(temperature, model_name):
    return ChatGroq(temperature=temperature, model_name=model_name)

def create_prompt(system_message, user_input):
    system = system_message
    human = "{text}"
    return ChatPromptTemplate.from_messages([("system", system), ("human", human)])

def generate_haiku(input_text):
    chat = create_chat_groq(temperature=0, model_name="llama3-8b-8192")
    prompt = create_prompt("You are wise poet and can write the best haiku.", input_text)
    chain = prompt | chat | StrOutputParser()
    haiku = chain.invoke({"text": input_text})
    # Split the haiku into lines and join them with newline characters
    formatted_haiku = '\n'.join(haiku.splitlines())
    return formatted_haiku

output = generate_haiku("pickles")
print(output)
