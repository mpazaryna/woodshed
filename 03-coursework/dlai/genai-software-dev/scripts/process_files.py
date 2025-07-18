#!/usr/bin/env python3

import logging
import subprocess
import sys
from pathlib import Path
from typing import Dict

import yaml


def setup_logging():
    """Configure logging format"""
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    return logging.getLogger(__name__)


def load_config(config_path: str) -> Dict:
    """
    Load and validate YAML configuration
    Args:
        config_path: Path to config YAML file
    Returns:
        Dict containing validated configuration
    """
    try:
        with open(config_path, "r") as f:
            config = yaml.safe_load(f)

        # Get project root (same directory as config.yaml)
        project_root = Path(config_path).parent

        # Convert paths to absolute using project root
        config["input_dir"] = str(project_root / config["input_dir"])
        config["output_dir"] = str(project_root / config["output_dir"])

        return config

    except Exception as e:
        print(f"Error loading config: {e}")
        sys.exit(1)


def process_files(config: Dict, logger: logging.Logger) -> None:
    """
    Process text files using fabric command
    Args:
        config: Configuration dictionary
        logger: Logger instance
    """
    input_dir = Path(config["input_dir"])
    output_dir = Path(config["output_dir"])

    # Create output directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)

    logger.info(f"Processing files from: {input_dir}")
    logger.info(f"Saving summaries to: {output_dir}")

    # Get all .txt files
    txt_files = list(input_dir.glob("*.txt"))

    if not txt_files:
        logger.error(f"No .txt files found in {input_dir}")
        sys.exit(1)

    for file_path in sorted(txt_files):
        filename = file_path.stem
        output_path = output_dir / f"{filename}-summary.md"

        logger.info(f"\nProcessing file: {filename}.txt")

        try:
            # Run fabric command using subprocess
            with open(file_path, "r") as infile:
                result = subprocess.run(
                    ["fabric", "--pattern", "summarize"],
                    input=infile.read(),
                    text=True,
                    capture_output=True,
                    check=True,
                )

            # Write output to file
            with open(output_path, "w") as outfile:
                outfile.write(result.stdout)

            logger.info(f"Finished processing: {filename}.txt")
            logger.info(f"Output written to: {output_path}")
            logger.info("-" * 35)

        except subprocess.CalledProcessError as e:
            logger.error(f"Error processing {filename}.txt: {e}")
            logger.error(f"Fabric command output: {e.stderr}")
            continue
        except Exception as e:
            logger.error(f"Error processing {filename}.txt: {e}")
            continue


def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/process_files.py config.yaml")
        sys.exit(1)

    logger = setup_logging()
    config = load_config(sys.argv[1])
    process_files(config, logger)

    logger.info("\nAll files have been processed.")


if __name__ == "__main__":
    main()
