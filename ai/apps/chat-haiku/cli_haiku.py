from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

# Initialize ChatGroq object with desired parameters
chat = ChatGroq(temperature=0, model_name="llama3-8b-8192")


system = "You are wise poet and can write the best haiku."
human = "{text}"
prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])

chain = prompt | chat | StrOutputParser()
output = chain.invoke({"text": "pickles"})

print(output)
