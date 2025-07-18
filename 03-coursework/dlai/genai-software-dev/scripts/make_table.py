import os

# Define the directory containing the files
directory = "./02-team-engineering/transcript/summaries"

# Initialize an empty list to hold the index entries
index_entries = []


# Function to recursively find Markdown files
def find_markdown_files(dir_path):
    for root, _, files in os.walk(dir_path):
        print(f"Checking in directory: {root}")  # Debugging output
        for filename in files:
            print(f"Found file: {filename}")  # Debugging output
            if filename.endswith(".md"):  # Check for Markdown files
                yield os.path.join(root, filename)


# Check if the directory exists
if os.path.exists(directory):
    print(f"Directory '{directory}' exists. Listing files...")
    # Loop through each Markdown file found in the directory and subdirectories
    for markdown_file in find_markdown_files(directory):
        # Create a description (customize this as needed)
        description = f"This is the summary for {os.path.basename(markdown_file).replace('.md', '')}."

        # Create a relative link to the file
        relative_path = os.path.relpath(markdown_file, start=directory)
        file_link = f"[{os.path.basename(markdown_file)}]({relative_path})"

        # Append the entry to the list
        index_entries.append(f"- {file_link}: {description}")
else:
    print(f"Error: The directory '{directory}' does not exist.")

# Write the index to a new file named summaries_index.md
if index_entries:  # Only write if there are entries
    with open("summaries_index.md", "w") as index_file:
        index_file.write("# Index of Summaries\n\n")
        index_file.write("\n".join(index_entries))
    print("Index created successfully in summaries_index.md.")
else:
    print("No Markdown files found. Index not created.")
