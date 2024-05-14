# refactored to call generate_poem from poem_generator.py
import streamlit as st
from poem_generator import generate_poem

def main():
    st.title("Poetry Bot")
    topic = st.text_input("Enter a topic for your poem:")
    poem_type = st.selectbox("Choose the type of poem:", ["haiku", "limerick"])

    if st.button(f"Generate {poem_type.capitalize()}"):
        poem_lines = generate_poem(topic, poem_type)
        for line in poem_lines:
            st.write(line)

if __name__ == "__main__":
    main()