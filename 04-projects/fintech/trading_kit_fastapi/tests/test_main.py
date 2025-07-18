# test_main.py
import pytest
from httpx import AsyncClient

from trading_kit_fastapi.main import app


@pytest.mark.asyncio
async def test_analyze_stock_trends():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/analyze_stock_trends",
            json={
                "company_name": "Test Corp",
                "dates": [
                    "2023-03-23",
                    "2023-03-24",
                    "2023-03-25",
                    "2023-03-26",
                    "2023-03-27",
                    "2023-03-28",
                    "2023-03-29",
                    "2023-03-30",
                    "2023-03-31",
                    "2023-04-01",
                    "2023-04-02",
                    "2023-04-03",
                    "2023-04-04",
                    "2023-04-05",
                    "2023-04-06",
                    "2023-04-07",
                    "2023-04-08",
                    "2023-04-09",
                    "2023-04-10",
                ],
                "prices": [
                    100.00,
                    100.50,
                    100.91,
                    100.24,
                    100.76,
                    101.08,
                    101.83,
                    101.75,
                    101.42,
                    102.73,
                    102.76,
                    103.71,
                    103.73,
                    103.11,
                    103.42,
                    103.35,
                    103.09,
                    104.38,
                    105.25,
                ],
                "short_window": 10,
                "long_window": 30,
                "precision": 2,
            },
        )
        assert response.status_code == 200
        result = response.json()
        assert result["company_name"] == "Test Corp"
        assert "short_wma" in result
        assert "long_wma" in result
        assert "signals" in result
