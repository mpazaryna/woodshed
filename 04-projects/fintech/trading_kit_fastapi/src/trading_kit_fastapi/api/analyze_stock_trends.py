# trading_kit_fastapi/src/trading_kit_fastapi/routes.py
from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from trading_kit.strategies.analyze_stock_wma import pandas_api_analyze_stock_trends

from .models import StockData

router = APIRouter()


@router.post("/analyze_stock_trends")
def analyze_stock_trends(data: StockData) -> Dict[str, Any]:
    # Validate the input data
    if not data.dates or not data.prices:
        raise HTTPException(
            status_code=422, detail="Dates and prices lists cannot be empty."
        )
    if len(data.dates) != len(data.prices):
        raise HTTPException(
            status_code=422, detail="Dates and prices lists must have the same length."
        )

    try:
        result = pandas_api_analyze_stock_trends(
            data.dates, data.prices, data.short_window, data.long_window, data.precision
        )
        result["company_name"] = data.company_name
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
