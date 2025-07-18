"""
Module for generating images using DALL-E.
"""

from openai import OpenAI

client = OpenAI()


def generate_image(prompt: str) -> str:
    """
    Generate an image using DALL-E based on the given prompt.

    Args:
        prompt (str): The text prompt for image generation.

    Returns:
        str: URL of the generated image.
    """
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )
    return response.data[0].url
