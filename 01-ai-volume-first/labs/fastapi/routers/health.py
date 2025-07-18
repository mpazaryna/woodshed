# routers/health.py
import time
from datetime import datetime

import psutil
from fastapi import APIRouter

router = APIRouter()
start_time = time.time()


@router.get("/health")
async def health_check():
    return {"status": "ok"}


@router.get("/health/details")
async def health_check_details():
    current_time = time.time()
    uptime = current_time - start_time

    try:
        connection_count = len(psutil.net_connections())
    except psutil.AccessDenied:
        connection_count = len(psutil.pids())

    return {
        "status": "ok",
        "performance": {
            "cpu_usage": psutil.cpu_percent(),
            "memory_usage": psutil.virtual_memory().percent,
            "disk_usage": psutil.disk_usage("/").percent,
            "uptime_seconds": uptime,
            "process_count": connection_count,
        },
        "timestamp": datetime.now().isoformat(),
    }
