# test_main.py
import pytest
from fastapi.testclient import TestClient

from trading_kit_fastapi.main import app

client = TestClient(app)


def test_analyze_stock_trends():
    data = {
        "dates": ["2023-01-01", "2023-01-02", "2023-01-03"],
        "prices": [100.0, 101.0, 102.0],
        "short_window": 2,
        "long_window": 3,
        "precision": 2,
        "company_name": "Test Corp",
    }

    response = client.post("/analyze_stock_trends", json=data)

    assert response.status_code == 200
    result = response.json()

    # Add more specific assertions based on the expected result
    assert "short_wma" in result
    assert "long_wma" in result
    assert len(result["short_wma"]) == len(data["dates"])
    assert len(result["long_wma"]) == len(data["dates"])


if __name__ == "__main__":
    pytest.main()
