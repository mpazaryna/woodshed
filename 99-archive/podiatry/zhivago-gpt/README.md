# zhivago-gpt

## A Command Line Driven Chatbot using LlamaIndex, LangChain, and Python

### Introduction

This project aims to build a proof-of-concept chatbot that leverages the power of local markdown files, the LlamaIndex library, LangChain, and Python. The chatbot will be command-line driven, allowing users to interact with it directly from their terminal. By ingesting markdown files into a Llama index, the chatbot can efficiently query and retrieve relevant information, providing users with quick and accurate responses.

### Getting Started

#### Prerequisites

- Python 3.x
- LlamaIndex library
- LangChain

Python 3.6 or higher using `venv` or `conda`. Using `venv`:

``` bash
cd cli
python3 -m venv env
source env/bin/activate
```

#### Installation

Create a Python environment

Python 3.6 or higher using `venv` or `conda`. Using `venv`:

``` bash
cd cli
python3 -m venv env
source env/bin/activate
```

Clone the repository:

   ```bash
   git clone [repository-link]
   ```

Navigate to the project directory:

   ```bash
   cd cli
   ```

Install the required libraries:

   ```bash
   pip install -r requirements.txt
   ```

Ingest your data into the Llama index:

   ```bash
   python ingest.py 
   ```

### Usage

1. Start the chatbot:

   ```bash
   python main.py
   ```

2. The command line will prompt you to enter your query. Type in your question and press enter.

3. The chatbot will search through the ingested files and provide a relevant response. If it cannot find a suitable answer, it will notify the user.

### Features

- **Command Line Interaction:** Directly interact with the chatbot from your terminal.  
- **LlamaIndex Integration:** Efficiently index and query markdown files for rapid response retrieval.
- **LangChain:** Ensures natural language processing for more accurate and human-like interactions.

### Conclusion

This chatbot serves as a foundational step for those looking to build more complex chatbot systems using markdown files and the LlamaIndex library. With the added power of LangChain, it ensures that interactions remain smooth and natural. As this is a proof-of-concept, there's ample room for expansion and improvement. Feedback and contributions are always welcome.

### Sample Questions

- Who is the doctor
- How do you prepare for surgery
- What is the recovery time for hip replacement
- Why would I want to see an orthopedic surgeon

### License

This project is licensed under the MIT License.

**Note:**

This Readme serves as a guideline for the development of the chatbot. As the project evolves, ensure that the Readme is updated to reflect the most recent changes and advancements.
