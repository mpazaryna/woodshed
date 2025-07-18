"""
Module for image processing tasks such as saving and encoding.
"""

import base64
import logging
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image


def save_image_from_url(
    url: str, scale_percent: int = 100, save_path: str = "image.png"
) -> None:
    """
    Download an image from a URL, optionally resize it, and save it to the file system.

    Args:
        url (str): The URL of the image to download.
        scale_percent (int, optional): Percentage to scale the image. Defaults to 100.
        save_path (str, optional): Path to save the image. Defaults to "image.png".
    """
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))

    if scale_percent != 100:
        width, height = img.size
        new_width = int(width * scale_percent / 100)
        new_height = int(height * scale_percent / 100)
        img = img.resize((new_width, new_height))

    img.save(save_path)
    logging.info(f"Image saved to {save_path}")


def encode_image(image_path: str) -> str:
    """
    Encode an image file to base64.

    Args:
        image_path (str): Path to the image file.

    Returns:
        str: Base64 encoded string of the image.
    """
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
