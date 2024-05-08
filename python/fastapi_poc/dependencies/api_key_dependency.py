# dependencies/api_key_dependency.py

from fastapi import HTTPException, Request

from config.settings import CUSTOM_API_KEY


def check_custom_api_key(request: Request):
    api_key = request.headers.get("X-Custom-API-Key")
    if api_key is None:
        raise HTTPException(status_code=401, detail="Missing API key")
    if api_key != CUSTOM_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
