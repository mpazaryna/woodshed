import pytest
from httpx import AsyncClient

from trading_kit_fastapi.main import app


@pytest.mark.asyncio
async def test_health_check():
    """
    Test the health check endpoint to verify server status.

    Asserts:
        The response status code is 200.
        The response JSON contains the status "ok".
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_server_utilization():
    """
    Test the server utilization endpoint to verify server resource usage.

    Asserts:
        The response status code is 200.
        The response JSON contains keys for CPU and memory usage.
        The values for CPU and memory usage are of the correct type.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/utilization")
        assert response.status_code == 200
        data = response.json()
        assert "cpu_usage" in data
        assert "memory_usage" in data
        assert "total_memory" in data
        assert "available_memory" in data
        assert isinstance(data["cpu_usage"], float)
        assert isinstance(data["memory_usage"], float)
