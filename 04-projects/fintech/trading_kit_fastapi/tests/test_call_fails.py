import pytest
from httpx import AsyncClient

from src.trading_kit_fastapi.main import app
from trading_kit_fastapi.api.models import StockData


@pytest.fixture
def invalid_stock_data() -> dict:
    """
    Fixture that provides invalid stock data for testing.

    Returns:
        dict: A dictionary representing invalid stock data.
    """
    return {
        "company_name": "Test Company",
        "prices": [],  # Invalid: empty prices list
        "dates": [],  # Invalid: empty dates list
        "short_window": 5,
        "long_window": 10,
        "precision": 2,
    }


@pytest.mark.asyncio
async def test_analyze_stock_trends_invalid_data(invalid_stock_data: dict):
    """
    Test that the analyze_stock_trends endpoint returns a 422 status code
    with an appropriate error message when provided with invalid stock data.

    Args:
        invalid_stock_data (dict): The invalid stock data fixture.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/analyze_stock_trends", json=invalid_stock_data)
        assert response.status_code == 422
