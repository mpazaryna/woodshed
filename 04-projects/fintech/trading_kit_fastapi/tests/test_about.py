import pytest
from httpx import AsyncClient

from trading_kit_fastapi.main import app


@pytest.mark.asyncio
async def test_get_about():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/about")
        assert response.status_code == 200
        assert response.json() == {
            "message": "This is the Trading Kit FastAPI application."
        }


@pytest.mark.asyncio
async def test_post_about():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {"info": "some information"}
        response = await ac.post("/about", json=payload)
        assert response.status_code == 200
        assert response.json() == {"received_info": payload}
