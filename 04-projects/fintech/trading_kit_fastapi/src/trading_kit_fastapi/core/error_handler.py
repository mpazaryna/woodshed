# src/trading_kit_fastapi/core/error_handler.py
from typing import Any, Dict, List, Union

from pydantic import BaseModel, ValidationError


class CustomError(BaseModel):
    loc: List[Union[str, int]]
    msg: str
    type: str


def handle_validation_error(exc: ValidationError) -> Dict[str, Any]:
    errors = [CustomError(**err) for err in exc.errors()]
    return {"errors": errors}
