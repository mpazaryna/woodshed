"""
scripts/mermaid_to_png.py

This script uses the installed mermaid-cli to convert Mermaid diagrams to PNG.

Prerequisites:
- Node.js and npm installed
- mermaid-cli installed globally (npm install -g @mermaid-js/mermaid-cli)

Usage:
python scripts/mermaid_to_png.py <input_file> <output_file>

Example:
python scripts/mermaid_to_png.py docs/diagrams/diagram.mmd docs/diagrams/diagram.png
"""

import subprocess
import sys


def mermaid_to_png(input_file, output_file):
    try:
        result = subprocess.run(
            ["mmdc", "-i", input_file, "-o", output_file],
            check=True,
            capture_output=True,
            text=True,
        )
        print(f"Successfully converted {input_file} to {output_file}")
        print(f"Command output: {result.stdout}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error converting {input_file}: {e.stderr}")
        return False


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python mermaid_to_png.py <input_file> <output_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    mermaid_to_png(input_file, output_file)
