# refactored to call generate_poem from poem_generator.py
import streamlit as st
from poem_generator import generate_poem


def display_poem(poem_lines, poem_type):
    if poem_type == "haiku":
        for line in poem_lines:
            st.write(line)
    else:
        st.write("\n".join(poem_lines))


def main():
    st.title("Poetry Bot")
    topic = st.text_input("Enter a topic for your poem:")
    poem_type = st.selectbox("Choose the type of poem:", ["haiku", "limerick"])

    if st.button(f"Generate {poem_type.capitalize()}"):
        try:
            poem_lines = generate_poem(topic, poem_type)
            display_poem(poem_lines, poem_type)
        except ValueError as e:
            st.error(f"Error: {str(e)}")
        except Exception as e:
            st.error(f"An unexpected error occurred: {str(e)}")


if __name__ == "__main__":
    main()
