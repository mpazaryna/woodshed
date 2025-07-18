import os

import markdown
from bs4 import BeautifulSoup


def markdown_to_text(markdown_string):
    """Converts a Markdown string to plaintext"""
    # Convert Markdown to HTML
    html = markdown.markdown(markdown_string)
    # Create a BeautifulSoup object and extract text
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text()


def convert_folder_of_markdown_to_text(folder_path, output_folder):
    """Converts all markdown files in a folder to plain text files"""
    # Check if output folder exists, if not, create it
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(folder_path):
        if filename.endswith(".md"):
            with open(
                os.path.join(folder_path, filename), "r", encoding="utf-8"
            ) as file:
                markdown_content = file.read()
            text_content = markdown_to_text(markdown_content)
            new_filename = filename.replace(".md", ".txt")
            with open(
                os.path.join(output_folder, new_filename), "w", encoding="utf-8"
            ) as file:
                file.write(text_content)


# Specify your folder path here
folder_path = "data/consolidated"
output_folder = "data/txt"
convert_folder_of_markdown_to_text(folder_path, output_folder)
