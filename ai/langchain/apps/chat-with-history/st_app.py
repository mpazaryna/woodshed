import streamlit as st
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

st.set_page_config(page_title="Chat with History", layout="wide")
st.title("Chat with History")


def get_response(user_query, chat_history):

    template = """
    You are a helpful assistant.  Answer the following questions considering the history of the conversations:
    
    Chat history: {chat_history}
    
    User question: {user_query}
    """

    prompt = ChatPromptTemplate.from_template(template)
    llm = ChatOpenAI()
    chain = prompt | llm | StrOutputParser()

    # chain is a runnable
    return chain.stream({"user_query": user_query, "chat_history": chat_history})


# session state
if "chat_history" not in st.session_state:
    st.session_state.chat_history = [
        AIMessage(content="How can I help you today?"),
    ]

# conversation
for message in st.session_state.chat_history:
    if isinstance(message, AIMessage):
        with st.chat_message("AI"):
            st.write(message.content)
    elif isinstance(message, HumanMessage):
        with st.chat_message("Human"):
            st.write(message.content)


# user input
user_query = st.chat_input("Your question:")
if user_query is not None and user_query != "":
    st.session_state.chat_history.append(HumanMessage(content=user_query))

    with st.chat_message("Human"):
        st.markdown(user_query)

    with st.chat_message("AI"):
        response = st.write_stream(
            get_response(user_query, st.session_state.chat_history)
        )

    st.session_state.chat_history.append(AIMessage(content=response))
