import os
import subprocess

directory_path = "downloads"


def format_markdown_file(file_path):
    try:
        subprocess.run(["prettier", "--write", file_path], check=True)
        print(f"[INFO] Formatted: {file_path}")
    except subprocess.CalledProcessError:
        print(f"[ERROR] Formatting failed for {file_path}")
    except Exception as e:
        print(f"[ERROR] Unexpected error for {file_path}:", e)


def main():
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                format_markdown_file(file_path)


if __name__ == "__main__":
    main()
