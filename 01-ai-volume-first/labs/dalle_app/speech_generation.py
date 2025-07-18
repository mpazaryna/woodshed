"""
Module for generating speech from text using OpenAI's text-to-speech API.
"""

import logging
from pathlib import Path

from openai import OpenAI

client = OpenAI()


def generate_speech(text: str, output_path: Path) -> None:
    """
    Generate an audio file from the given text using OpenAI's text-to-speech.

    Args:
        text (str): The text to convert to speech.
        output_path (Path): The path to save the generated audio file.
    """
    response = client.audio.speech.create(model="tts-1", voice="onyx", input=text)

    with open(output_path, "wb") as file:
        file.write(response.content)

    logging.info(f"Audio file saved to {output_path}")
