import streamlit as st

from agent_example import run_openai_agent  # Import the new feature
from intro import show_intro


def main():
    st.sidebar.success("Select a demo")
    # Add the new feature to the selection
    demo_name = st.sidebar.selectbox(
        "Choose a demo", ["—", "Agent Example", "DataFrame Filter"]
    )

    if demo_name == "—":
        show_intro()
    elif demo_name == "Agent Example":
        run_openai_agent()
    elif demo_name == "DataFrame Filter":  # Condition to show the new feature
        run_openai_agent()


if __name__ == "__main__":
    main()
