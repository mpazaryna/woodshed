# config/settings.py

import os

from dotenv import load_dotenv

load_dotenv()

CUSTOM_API_KEY = os.environ.get("CUSTOM_API_KEY", "")
