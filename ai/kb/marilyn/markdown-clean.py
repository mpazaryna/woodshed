import os
import re

# Define the directory where markdown files are located
directory_path = "./downloads"  # Relative path to 'download' directory

# Define the regular expression pattern to find the image links
image_pattern = r"!\[\]\(https://images\.squarespace-cdn\.com/.*?\)"

# Define the regular expression pattern to find headers with bold text
bold_header_pattern = r"(#+) \*\*(.*?)\*\*"


# Function to remove HTML links from markdown content
def remove_html_links(markdown_content):
    # The following regex pattern matches most of the common HTML links
    # such as <a href="...">...</a> or <link ... >
    pattern = r"<a .*?>.*?</a>|<link.*?>"
    return re.sub(pattern, "", markdown_content)


# Function to remove bold from headers
def remove_bold_from_headers(text):
    return re.sub(bold_header_pattern, r"\1 \2", text)


def remove_markdown_links(markdown_content):
    # The following regex pattern matches markdown links like [label](url)
    pattern = r"\[.*?\]\(.*?\)"
    return re.sub(pattern, "", markdown_content)


def keep_link_name_only(markdown_content):
    # The following regex pattern matches markdown links like [link name](URL)
    # and captures the link name for replacement
    pattern = r"\[(.*?)\]\(.*?\)"
    return re.sub(pattern, r"\1", markdown_content)


def replace_high_ascii(text):
    # Mapping of high ASCII characters to their replacements
    replacements = {
        "’": "'",
        "“": '"',
        "”": '"',
        "‘": "'",
        "—": "-",  # en dash
        "–": "-"  # em dash
        # Add more mappings as needed
    }

    for high_ascii, replacement in replacements.items():
        text = text.replace(high_ascii, replacement)
    return text


# Loop through each file in the directory
for filename in os.listdir(directory_path):
    # Check if the file is a markdown file
    if filename.endswith(".md"):
        file_path = os.path.join(directory_path, filename)

        with open(file_path, "r") as file:
            content = file.read()

            # Replace the image links with an empty string
            content = re.sub(image_pattern, "", content)

            # Remove bold from headers
            content = remove_bold_from_headers(content)

            # Remove HTML links
            content = remove_html_links(content)

            # Remove markdown links
            # content = remove_markdown_links(content)

            # Remove markdown links and keep the link name only
            content = keep_link_name_only(content)

            # Replace high ASCII characters
            content = replace_high_ascii(content)

        # Write the updated content back to the file
        with open(file_path, "w") as file:
            file.write(content)

print("Image links and unnecessary bold removed from markdown files.")
