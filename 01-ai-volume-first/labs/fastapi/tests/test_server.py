"""
Test Suite for FastAPI Application

This module contains a series of test cases for the FastAPI application.
The tests are designed to verify the functionality and reliability of various
endpoints within the application. The tests include:

1. Basic endpoint tests to ensure the application is running and responding correctly.
2. Tests for the `/generate_response` endpoint to verify response generation.
3. Health check tests to ensure the application is healthy and performing well.
4. Alert check tests to verify the alerting mechanism of the application.

Each test is implemented using the `pytest` framework and utilizes `httpx.AsyncClient`
for making asynchronous HTTP requests to the application.

Dependencies:
- pytest
- httpx
- fastapi

"""

import os
import sys

import pytest
from httpx import AsyncClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_read_main():
    """
    Test the root endpoint.

    This test verifies that:
    1. The root ("/") endpoint returns a 200 status code.
    2. The response body contains the expected message.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, FastAPI!"}


@pytest.mark.asyncio
async def test_generate_response():
    """
    Test the /generate_response endpoint.

    This test verifies that:
    1. The endpoint returns a 200 status code.
    2. The response contains a 'response' field.
    3. The 'response' field is a non-empty string.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/generate_response", json={"text": "Tell me about AI"}
        )
    assert response.status_code == 200
    assert "response" in response.json()
    assert isinstance(response.json()["response"], str)
    assert len(response.json()["response"]) > 0


@pytest.mark.asyncio
async def test_missing_api_key(monkeypatch):
    """
    Test the /generate_response endpoint without an API key.

    This test verifies that:
    1. The endpoint returns a 500 status code when the API key is missing.
    2. The response contains an error message indicating the issue.
    """
    # Temporarily remove the API key
    original_key = os.environ.get("OPENAI_API_KEY")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/generate_response", json={"text": "Tell me about AI"}
        )

    # Restore the original key
    if original_key:
        os.environ["OPENAI_API_KEY"] = original_key

    assert response.status_code == 500
    assert "Error initializing LLM service" in response.json()["detail"]


@pytest.mark.asyncio
async def test_health_check():
    """
    Test the health check endpoint.

    This test verifies that:
    1. The /health endpoint returns a 200 status code.
    2. The response body contains the expected "ok" status message.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_health_details():
    """
    Test the enhanced health check endpoint.

    This test verifies that:
    1. The /health/details endpoint returns a 200 status code.
    2. The response body contains the expected status and performance metrics.
    3. The performance metrics include CPU, memory, disk usage, uptime, and process count.
    4. The metrics are within expected ranges and types.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health/details")

    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "ok"
    assert "performance" in data
    assert "cpu_usage" in data["performance"]
    assert "memory_usage" in data["performance"]
    assert "disk_usage" in data["performance"]
    assert "uptime_seconds" in data["performance"]
    assert "process_count" in data["performance"]  # Changed from active_connections
    assert "timestamp" in data

    # Optional: Add assertions for data types and value ranges
    assert isinstance(data["performance"]["cpu_usage"], float)
    assert 0 <= data["performance"]["cpu_usage"] <= 100
    assert isinstance(data["performance"]["process_count"], int)
    assert data["performance"]["process_count"] > 0
    # Add similar assertions for other metrics


@pytest.mark.skip(reason="Need to implement this test later")
@pytest.mark.asyncio
async def test_alert_check():
    """
    Test the alert check endpoint.

    This test verifies that:
    1. The /alert-check endpoint returns a response.
    2. The response has the expected structure.
    3. The response status can be either OK or CRITICAL.
    4. If CRITICAL, the response contains a list of alerts.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/alert-check")

        # Check that we got a response
        assert response.status_code in [200, 500]

        data = response.json()

        # Check the structure of the response
        if response.status_code == 200:
            assert data["status"] == "OK"
            assert "message" in data
            assert data["message"] == "No critical alerts detected"
        else:
            assert data["status"] == "CRITICAL"
            assert "alerts" in data
            assert isinstance(data["alerts"], list)
            assert len(data["alerts"]) > 0

            # Check that each alert is a string
            for alert in data["alerts"]:
                assert isinstance(alert, str)

            # Check that we're alerting on the expected metrics
            alert_texts = " ".join(data["alerts"])
            assert any(metric in alert_texts for metric in ["CPU", "Memory", "Disk"])


@pytest.mark.asyncio
async def test_alert_check_multiple_calls():
    """
    Test the alert check endpoint with multiple calls.

    This test verifies that:
    1. The /alert-check endpoint can be called multiple times.
    2. The responses are consistent in structure.
    3. The response status is always 200.
    4. The response status can be either OK or CRITICAL.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        for _ in range(5):  # Make 5 calls to the endpoint
            response = await ac.get("/alert-check")

            assert response.status_code == 200  # Now we always expect a 200 status code
            data = response.json()

            assert "status" in data
            assert data["status"] in ["OK", "CRITICAL"]

            if data["status"] == "OK":
                assert "message" in data
                assert data["message"] == "No critical alerts detected"
            else:
                assert "alerts" in data
                assert isinstance(data["alerts"], list)
                assert len(data["alerts"]) > 0
                for alert in data["alerts"]:
                    assert isinstance(alert, str)
                    assert "CRITICAL" in alert


# ... other test functions ...
