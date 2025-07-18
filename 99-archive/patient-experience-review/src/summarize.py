
import os

from dotenv import find_dotenv, load_dotenv
from openai import OpenAI

load_dotenv(find_dotenv())
API_KEY=os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)

def read_file_paths(file_path_list):
    """Reads a file containing a list of file paths and returns them as a list."""
    try:
        with open(file_path_list, 'r', encoding='utf-8') as file:
            file_paths = file.read().splitlines()
        print(f"Read {len(file_paths)} file paths.")
        return file_paths
    except FileNotFoundError:
        print(f"File not found: {file_path_list}")
        return []

def read_markdown_file(file_path):
    """Reads the content of a markdown file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return None

def summarize_text(text, model="text-davinci-003", max_tokens=100):
    """Summarizes the given text using the specified AI model."""
    try:
        response = client.completions.create(
            model=model,
            prompt="Summarize the following text:\n\n" + text,
            max_tokens=max_tokens
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def save_summary_to_file(summary, original_file_path):
    """Saves the summary to a file in the data/reports folder with the last directory name as a prefix."""
    parts = original_file_path.split(os.sep)
    if len(parts) > 1:
        filename = f"{parts[-2]}-{parts[-1]}"
    else:
        filename = parts[-1]

    summary_file_path = os.path.join('data/reports', filename)
    try:
        with open(summary_file_path, 'w', encoding='utf-8') as file:
            file.write(summary)
        print(f"Summary saved to {summary_file_path}")
    except Exception as e:
        print(f"Error saving summary: {e}")

# Path to the file containing list of markdown file paths
file_list_path = 'src/summarize_files.txt'

# Ensure the reports directory exists
os.makedirs('data/reports', exist_ok=True)

# Read the list of markdown file paths
file_paths = read_file_paths(file_list_path)

# Process each markdown file
for path in file_paths:
    print(f"Processing file: {path}")
    markdown_content = read_markdown_file(path)
    if markdown_content:
        summary = summarize_text(markdown_content)
        save_summary_to_file(summary, path)
    else:
        print(f"No content to process for file: {path}")
