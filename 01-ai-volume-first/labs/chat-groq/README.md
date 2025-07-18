# Groq Chat Streamlit App

This project is a Streamlit application that interacts with the Groq API to provide chat functionalities. The application allows users to select a model, set the maximum number of tokens, and interact with the chat interface.

## Recent Changes and Optimizations

### Code Refactoring

- **Separation of Concerns**: The code has been refactored to separate the Groq API interaction logic from the main Streamlit application. This was achieved by creating a new utility file, `groq_utils.py`.

### `groq_utils.py`

- **Functions Moved**:
  - `create_groq_client`: Initializes and returns a Groq client instance.
  - `generate_chat_responses`: Generates chat responses from the Groq API response.
  - `fetch_groq_response`: Fetches responses from the Groq API using the provided client, model, messages, and token limit.

### `st_demo_optimized.py`

- **Code Simplification**: The main Streamlit application now imports and uses the functions from `groq_utils.py`, resulting in cleaner and more maintainable code.
- **Improved Readability**: By moving the Groq API logic to a separate file, the Streamlit app code is easier to read and understand.

## How to Run

1. Ensure you have Python and Streamlit installed.
2. Run the Streamlit app using the following command:

   ```bash
   streamlit run apps/chat-groq/st_chat.py
   ```

## Future Improvements

- **Error Handling**: Enhance error handling for API interactions.
- **Testing**: Add unit tests for the utility functions to ensure reliability.
- **Documentation**: Expand the documentation to include more detailed usage instructions and examples.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.
