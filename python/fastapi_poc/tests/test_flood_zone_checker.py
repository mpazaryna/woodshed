# test_flood_zone.py
import pytest
import requests_mock

# from flood_zone_checker import is_in_flood_zone
from agents.fema.flood_zone_checker import is_in_flood_zone


def test_is_in_flood_zone_true():
    with requests_mock.Mocker() as m:
        m.get(
            "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query",
            json={"features": [{"attributes": {"FLD_ZONE": "A"}}]},
        )
        assert is_in_flood_zone(35.6895, 139.6917) == (True, "A")


def test_is_in_flood_zone_false():
    with requests_mock.Mocker() as m:
        m.get(
            "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query",
            json={"features": []},
        )
        assert is_in_flood_zone(35.6895, 139.6917) == (False, None)


def test_is_in_flood_zone_invalid_coordinates():
    assert is_in_flood_zone(100, 250) == (False, None)


def test_is_in_flood_zone_api_error():
    with requests_mock.Mocker() as m:
        m.get(
            "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query",
            status_code=500,
        )
        assert is_in_flood_zone(35.6895, 139.6917) == (False, None)


def test_is_in_flood_zone_no_fld_zone():
    with requests_mock.Mocker() as m:
        m.get(
            "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query",
            json={"features": [{"attributes": {}}]},
        )
        assert is_in_flood_zone(35.6895, 139.6917) == (False, None)


@pytest.mark.integration
def test_flood_zone_real_coordinates():
    # Example coordinates for which you know the flood zone status
    lat, lon = 40.070893, -74.042243  # Real coordinates

    # Expected results based on known flood zone data for these coordinates
    expected_in_flood_zone = True  # Adjust based on real data
    expected_flood_zone_code = "VE"  # Adjust based on real data

    is_flood_zone, flood_zone_code = is_in_flood_zone(lat, lon)

    assert is_flood_zone == expected_in_flood_zone
    assert flood_zone_code == expected_flood_zone_code
