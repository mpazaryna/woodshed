import argparse
import os

import mdformat


def lint_and_fix_markdown(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                print(f"Processing: {file_path}")

                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                # Lint and fix the content
                fixed_content = mdformat.text(content)

                # Write the fixed content back to the file
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(fixed_content)

                print(f"Fixed and saved: {file_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Lint and fix Markdown files in a folder"
    )
    parser.add_argument("folder", help="Path to the folder containing Markdown files")
    args = parser.parse_args()

    lint_and_fix_markdown(args.folder)


if __name__ == "__main__":
    main()
