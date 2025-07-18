from typing import Generator

import streamlit as st
from error_utils import handle_error
from groq_utils import create_groq_client, fetch_groq_response, generate_chat_responses

# Constants
DEFAULT_MODEL_INDEX = 4
MIN_SLIDER_VALUE = 512

st.set_page_config(page_icon="💬", layout="wide", page_title="Groq Goes Brrrrrrrr...")


def icon(emoji: str):
    """Shows an emoji as a Notion-style page icon."""
    st.write(
        f'<span style="font-size: 78px; line-height: 1">{emoji}</span>',
        unsafe_allow_html=True,
    )


def initialize_session_state():
    """Initialize session state variables."""
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "selected_model" not in st.session_state:
        st.session_state.selected_model = None


def get_models():
    """Return a dictionary of available models."""
    return {
        "gemma-7b-it": {"name": "Gemma-7b-it", "tokens": 8192, "developer": "Google"},
        "llama2-70b-4096": {
            "name": "LLaMA2-70b-chat",
            "tokens": 4096,
            "developer": "Meta",
        },
        "llama3-70b-8192": {
            "name": "LLaMA3-70b-8192",
            "tokens": 8192,
            "developer": "Meta",
        },
        "llama3-8b-8192": {
            "name": "LLaMA3-8b-8192",
            "tokens": 8192,
            "developer": "Meta",
        },
        "mixtral-8x7b-32768": {
            "name": "Mixtral-8x7b-Instruct-v0.1",
            "tokens": 32768,
            "developer": "Mistral",
        },
    }


def select_model(models):
    """Handle model selection and update session state."""
    model_option = st.selectbox(
        "Choose a model:",
        options=list(models.keys()),
        format_func=lambda x: models[x]["name"],
        index=DEFAULT_MODEL_INDEX,
    )
    if st.session_state.selected_model != model_option:
        st.session_state.messages = []
        st.session_state.selected_model = model_option
    return model_option


def set_max_tokens_slider(max_tokens_range):
    """Set the max tokens slider based on the selected model."""
    return st.slider(
        "Max Tokens:",
        min_value=MIN_SLIDER_VALUE,
        max_value=max_tokens_range,
        value=min(32768, max_tokens_range),
        step=MIN_SLIDER_VALUE,
        help=f"Adjust the maximum number of tokens (words) for the model's response. Max for selected model: {max_tokens_range}",
    )


def display_chat_history():
    """Display chat messages from history."""
    for message in st.session_state.messages:
        avatar = "🤖" if message["role"] == "assistant" else "👨‍💻"
        with st.chat_message(message["role"], avatar=avatar):
            st.markdown(message["content"])


def generate_chat_responses(chat_completion) -> Generator[str, None, None]:
    """Yield chat response content from the Groq API response."""
    for chunk in chat_completion:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


def handle_user_input(client, model_option, max_tokens):
    """Handle user input and fetch response from Groq API."""
    if prompt := st.chat_input("Enter your prompt here..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user", avatar="👨‍💻"):
            st.markdown(prompt)

        try:
            chat_completion = fetch_groq_response(
                client,
                model_option,
                [
                    {"role": m["role"], "content": m["content"]}
                    for m in st.session_state.messages
                ],
                max_tokens,
            )
            with st.chat_message("assistant", avatar="🤖"):
                chat_responses_generator = generate_chat_responses(chat_completion)
                full_response = st.write_stream(chat_responses_generator)
        except Exception as e:
            handle_error(e, context="Fetching response from Groq API")

        if isinstance(full_response, str):
            st.session_state.messages.append(
                {"role": "assistant", "content": full_response}
            )
        else:
            combined_response = "\n".join(str(item) for item in full_response)
            st.session_state.messages.append(
                {"role": "assistant", "content": combined_response}
            )


def main():
    icon("🏎️")
    st.subheader("Groq Chat Streamlit App", divider="rainbow", anchor=False)
    client = create_groq_client()
    initialize_session_state()
    models = get_models()
    col1, col2 = st.columns(2)

    with col1:
        model_option = select_model(models)

    max_tokens_range = models[model_option]["tokens"]

    with col2:
        max_tokens = set_max_tokens_slider(max_tokens_range)

    display_chat_history()
    handle_user_input(client, model_option, max_tokens)


if __name__ == "__main__":
    main()
