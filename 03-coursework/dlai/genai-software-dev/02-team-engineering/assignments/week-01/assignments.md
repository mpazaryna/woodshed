# All Assignments

## Week 1

### flask_app.py

Once you have the app up and running, think through the test cases you might want to consider to check that the app functions as expected. Try writing code to test the usage of the app for the cases you come up with. You don’t need to write full tests at this point, simple test use cases are enough to get started.

Next, ask an LLM to analyze the flask app code and come up with a set of test cases to check how the app functions. . Compare the output of the model to your own list of ideas. When you are done, come back to see how Laurence carried out this conversation.

To analyze the Flask app code and come up with a set of test cases, let's first break down what the app does:

1. **Route Definition**: The app defines a single route `/api/greet/<name>` that accepts a `GET` request.
2. **Functionality**: When accessed, it returns a JSON response with a message greeting the user by name.
3. **Running the App**: The app runs in debug mode when executed directly.

Based on this, here are some test cases that could be used to verify the functionality of the app:

### Test Cases

1. **Test the `/api/greet/<name>` Route with a Valid Name**:
   - **Input**: A valid name string, e.g., `/api/greet/Alice`.
   - **Expected Output**: JSON response `{"message": "Hello, Alice!"}`.

2. **Test the `/api/greet/<name>` Route with Special Characters**:
   - **Input**: A name with special characters, e.g., `/api/greet/John-Doe`.
   - **Expected Output**: JSON response `{"message": "Hello, John-Doe!"}`.

3. **Test the `/api/greet/<name>` Route with an Empty Name**:
   - **Input**: An empty name, e.g., `/api/greet/`.
   - **Expected Output**: The server should return a 404 error or handle it gracefully if implemented.

4. **Test the `/api/greet/<name>` Route with a Long Name**:
   - **Input**: A very long name string, e.g., `/api/greet/` followed by a long string.
   - **Expected Output**: JSON response with the long name, or check for any server errors.

5. **Test the `/api/greet/<name>` Route with a Non-GET Method**:
   - **Input**: Use a POST or PUT request on `/api/greet/Alice`.
   - **Expected Output**: The server should return a 405 Method Not Allowed error.

6. **Test the App's Response to Invalid Routes**:
   - **Input**: Access a non-existent route, e.g., `/api/unknown`.
   - **Expected Output**: The server should return a 404 Not Found error.

### Comparison with LLM Output

If you were to ask an LLM to generate test cases, you would compare its suggestions to the above list. You would look for:

- **Coverage**: Does the LLM suggest tests for all the edge cases and typical use cases?
- **Creativity**: Does the LLM suggest any additional test cases that you might have missed?
- **Accuracy**: Are the expected outcomes suggested by the LLM correct?

Once you have both sets of test cases, you can evaluate which ones are more comprehensive and if there are any additional insights provided by the LLM.

#### Prompt

> As an expert software tester who is teaching a new person how to write test cases, can you please analyze this code and provide a set of test cases, explaining each one in a docstring.
