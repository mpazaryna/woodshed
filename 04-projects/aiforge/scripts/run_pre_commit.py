#!/usr/bin/env python3
# run_pre_commit.py - Script to run pre-commit on all files

import subprocess
import sys


def run_pre_commit():
    print("Running pre-commit on all files...")
    try:
        result = subprocess.run(
            ["poetry", "run", "pre-commit", "run", "--all-files"],
            check=True,
            capture_output=True,
            text=True,
        )
        print(result.stdout)
        print("Pre-commit completed successfully!")
    except subprocess.CalledProcessError as e:
        print("Error running pre-commit:")
        print(e.stdout)
        print(e.stderr, file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    run_pre_commit()
