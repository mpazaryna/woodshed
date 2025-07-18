import os
from pathlib import Path


class Config:
    # Directories
    BASE_DIR = Path(__file__).resolve().parent
    OUTPUT_DIR = BASE_DIR / "output"
    LOGS_DIR = BASE_DIR / "logs"

    # File names
    IMAGE_FILE = "image.png"
    AUDIO_FILE = "story.mp3"
    LOG_FILE = "dalle_app.log"

    # DALL-E settings
    IMAGE_PROMPT = "a beach yoga class set in Asbury Park, NJ"
    IMAGE_SCALE_PERCENT = 50

    # API keys (consider using environment variables for sensitive information)
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    # Other settings
    LOGGING_LEVEL = "INFO"


config = Config()
