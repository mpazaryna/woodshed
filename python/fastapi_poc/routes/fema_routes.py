# routes/fema_routes.py

from fastapi import APIRouter, Depends, HTTPException

from agents.fema.flood_zone_checker import is_in_flood_zone
from dependencies.api_key_dependency import check_custom_api_key

from .models import FloodZoneInquiry

router = APIRouter()


@router.post("/check-flood-zone/")
async def check_flood_zone(latitude: float, longitude: float):
    try:
        is_flood_zone, flood_zone_code = is_in_flood_zone(latitude, longitude)
        return {
            "latitude": latitude,
            "longitude": longitude,
            "is_in_flood_zone": is_flood_zone,
            "flood_zone_code": flood_zone_code,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
