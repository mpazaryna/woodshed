import json
import os
from pathlib import Path

import yaml


def extract_notebook_info(notebook_path):
    """
    Extract relevant information from a Jupyter notebook.
    Attempts to find description from the first markdown cell.
    """
    try:
        with open(notebook_path, "r", encoding="utf-8") as f:
            notebook = json.load(f)

        # Try to find first markdown cell for description
        description = "No description available"
        for cell in notebook["cells"]:
            if cell["cell_type"] == "markdown":
                # Get first non-empty line
                lines = cell["source"]
                for line in lines:
                    if line.strip() and not line.startswith("#"):
                        description = line.strip()
                        break
                if description != "No description available":
                    break

        return description
    except Exception as e:
        print(f"Error reading notebook {notebook_path}: {e}")
        return "Error reading notebook"


def generate_yaml_entry(
    notebook_path,
    repo_base_url="https://github.com/togethercomputer/together-cookbook/blob/main",
):
    """
    Generate a YAML entry for a notebook.
    """
    notebook_name = os.path.basename(notebook_path)
    relative_path = os.path.relpath(notebook_path)
    description = extract_notebook_info(notebook_path)

    # Generate GitHub URL
    github_url = f"{repo_base_url}/{relative_path}"

    # Generate Colab URL
    colab_url = f"https://colab.research.google.com/github/togethercomputer/together-cookbook/blob/main/{relative_path}"

    entry = {
        "Cookbook": f"[{notebook_name.replace('.ipynb', '')}]({github_url})",
        "Description": description,
        "Open": f"[![Colab](https://colab.research.google.com/assets/colab-badge.svg)]({colab_url})",
    }

    return entry


def find_notebooks_and_generate_yaml(root_dir, output_file="cookbooks.yaml"):
    """
    Walk through directory to find notebooks and generate YAML file.
    """
    notebooks = []

    # Walk through directory
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".ipynb") and not file.endswith("-checkpoint.ipynb"):
                notebook_path = os.path.join(root, file)
                print(f"Processing notebook: {notebook_path}")
                entry = generate_yaml_entry(notebook_path)
                notebooks.append(entry)

    # Sort notebooks by name
    notebooks.sort(key=lambda x: x["Cookbook"])

    # Write to YAML file
    with open(output_file, "w", encoding="utf-8") as f:
        yaml.safe_dump(notebooks, f, allow_unicode=True, sort_keys=False)

    print(f"\nGenerated YAML entries for {len(notebooks)} notebooks")
    print(f"YAML file saved to: {output_file}")
    return notebooks


def main():
    """
    Main function to run the script.
    """
    import argparse

    parser = argparse.ArgumentParser(
        description="Generate YAML entries from Jupyter notebooks"
    )
    parser.add_argument(
        "--root",
        type=str,
        default=".",
        help="Root directory to search for notebooks (default: current directory)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="cookbooks.yaml",
        help="Output YAML file (default: cookbooks.yaml)",
    )
    parser.add_argument(
        "--repo-url",
        type=str,
        default="https://github.com/togethercomputer/together-cookbook/blob/main",
        help="Base URL for the GitHub repository",
    )

    args = parser.parse_args()

    find_notebooks_and_generate_yaml(root_dir=args.root, output_file=args.output)


if __name__ == "__main__":
    main()
