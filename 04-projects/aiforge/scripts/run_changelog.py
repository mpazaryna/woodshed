#!/usr/bin/env python3
# run_changelog.py

import os
import subprocess
import sys


def run_changelog_generator():
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Construct the path to the shell script
    shell_script_path = os.path.join(script_dir, "changelog_generator.sh")

    # Make sure the shell script is executable
    os.chmod(shell_script_path, 0o755)

    # Run the shell script with all arguments passed to this Python script
    try:
        result = subprocess.run([shell_script_path] + sys.argv[1:], check=True)
        sys.exit(result.returncode)
    except subprocess.CalledProcessError as e:
        print(f"Error running changelog generator: {e}", file=sys.stderr)
        sys.exit(e.returncode)


if __name__ == "__main__":
    run_changelog_generator()
