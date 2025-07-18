"""
Module for describing images using GPT-4 Vision.
"""

import logging
import os
from typing import Any, Dict

import requests
from image_processing import encode_image


def describe_image(image_path: str) -> str:
    """
    Use GPT-4 Vision to generate a description of the image.

    Args:
        image_path (str): Path to the image file.

    Returns:
        str: Generated description of the image.
    """
    base64_image = encode_image(image_path)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
    }

    payload: Dict[str, Any] = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe what's in this image in detail as a story?",
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                ],
            }
        ],
        "max_tokens": 300,
    }

    response = requests.post(
        "https://api.openai.com/v1/chat/completions", headers=headers, json=payload
    )

    if response.status_code != 200:
        logging.error(f"API Error: {response.status_code} - {response.text}")
        return "Error in API call"

    response_json = response.json()
    if "choices" not in response_json:
        logging.error(f"Unexpected response structure: {response_json}")
        return "Unexpected response structure"

    return response_json["choices"][0]["message"]["content"]
