"""
Main driver script for the DALL-E Image Generation and Description Application.

This script orchestrates the entire process of generating an image,
describing it, and creating an audio narration of the description.
"""

import logging
from pathlib import Path

from config import config  # Import the config object
from image_description import describe_image
from image_generation import generate_image
from image_processing import save_image_from_url
from speech_generation import generate_speech
from utils import setup_logging


def create_directories():
    """
    Create output and logs directories if they don't exist.
    """
    Path(config.OUTPUT_DIR).mkdir(exist_ok=True)  # Use config for output directory
    Path(config.LOGS_DIR).mkdir(exist_ok=True)  # Use config for logs directory


def main():
    """
    Main function to orchestrate the image generation, description, and audio creation process.
    """
    create_directories()
    setup_logging(log_file=config.LOGS_DIR / config.LOG_FILE)  # Use config for log file

    prompt = config.IMAGE_PROMPT  # Use config for the image prompt

    # Generate and save image
    image_url = generate_image(prompt)
    logging.info(f"Generated image URL: {image_url}")

    save_path = Path(config.OUTPUT_DIR) / config.IMAGE_FILE  # Use config for save path
    save_image_from_url(
        image_url, scale_percent=config.IMAGE_SCALE_PERCENT, save_path=str(save_path)
    )

    # Generate image description
    story = describe_image(str(save_path))
    logging.info("\nImage Description:")
    logging.info(story)

    # Generate speech from the story and save as MP3
    audio_path = (
        Path(config.OUTPUT_DIR) / config.AUDIO_FILE
    )  # Use config for audio path
    generate_speech(story, audio_path)


if __name__ == "__main__":
    main()
