# trading_kit_fastapi/src/trading_kit_fastapi/models.py
from typing import List

from pydantic import BaseModel


class StockData(BaseModel):
    company_name: str
    dates: List[str]
    prices: List[float]
    short_window: int = 10
    long_window: int = 30
    precision: int = 2
