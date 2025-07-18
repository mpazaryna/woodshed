# demo-openai-agent.py
import time
from textwrap import dedent

import openai
import streamlit as st


def run_openai_agent():
    assistant_id = st.secrets["OPENAI_ASSISTANT_ID"]
    openai.api_key = st.secrets["OPENAI_API_KEY"]
    client = openai

    if "start_chat" not in st.session_state:
        st.session_state.start_chat = False
    if "thread_id" not in st.session_state:
        st.session_state.thread_id = None

    if st.sidebar.button("Start Chat"):
        st.session_state.start_chat = True
        thread = client.beta.threads.create()
        st.session_state.thread_id = thread.id

    st.title("Airbnb FAQ")
    st.write("Agent Example")

    if st.button("Exit Chat"):
        st.session_state.messages = []  # Clear the chat history
        st.session_state.start_chat = False  # Reset the chat state
        st.session_state.thread_id = None

    if st.session_state.start_chat:
        if "openai_model" not in st.session_state:
            st.session_state.openai_model = "gpt-4-1106-preview"
        if "messages" not in st.session_state:
            st.session_state.messages = []

        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])

        if prompt := st.chat_input("How Can I Help?"):
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)

            client.beta.threads.messages.create(
                thread_id=st.session_state.thread_id, role="user", content=prompt
            )

            run = client.beta.threads.runs.create(
                thread_id=st.session_state.thread_id,
                assistant_id=assistant_id,
                instructions=dedent(
                    """\
                    You're a helpful WhatsApp assistant that can assist owners that are have in 
                    properties in Duchess County AirBnb. Use your knowledge base to best respond to owner queries. 
                    If you don't know the answer, say simply that you cannot help with question and 
                    advice to contact the county directly. Be friendly and professional."""
                ),
            )

            while run.status != "completed":
                time.sleep(1)
                run = client.beta.threads.runs.retrieve(
                    thread_id=st.session_state.thread_id, run_id=run.id
                )
            messages = client.beta.threads.messages.list(
                thread_id=st.session_state.thread_id
            )

            # Process and display assistant messages
            assistant_messages_for_run = [
                message
                for message in messages
                if message.run_id == run.id and message.role == "assistant"
            ]
            for message in assistant_messages_for_run:
                st.session_state.messages.append(
                    {"role": "assistant", "content": message.content[0].text.value}
                )
                with st.chat_message("assistant"):
                    st.markdown(message.content[0].text.value)

    else:
        st.write("Click 'Start Chat' to begin.")
