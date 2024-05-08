# flood_zone_checker.py

import requests

BASE_URL = (
    "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query"
)
QUERY_PARAMS = {
    "geometryType": "esriGeometryPoint",
    "inSR": "4326",
    "spatialRel": "esriSpatialRelIntersects",
    "outFields": "FLD_ZONE",
    "returnGeometry": "false",
    "f": "json",
}


def fetch_flood_zone_data(lat: float, lon: float):
    """Fetches flood zone data from FEMA service."""
    params = QUERY_PARAMS.copy()
    params["geometry"] = f"{lon},{lat}"

    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        # Consider logging the error here
        return None


def is_in_flood_zone(lat: float, lon: float) -> (bool, str):
    """Determines if given coordinates are in a flood zone, and returns the flood zone code."""
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        return False, None

    data = fetch_flood_zone_data(lat, lon)
    if not data or "features" not in data or not data["features"]:
        return False, None

    flood_zone = data["features"][0]["attributes"].get("FLD_ZONE")
    if flood_zone:
        return True, flood_zone
    else:
        return False, None
