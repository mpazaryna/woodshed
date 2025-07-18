# src/afnova/server/routers/alert.py

import psutil
from fastapi import APIRouter

from aiforge.server.config import (CRITICAL_CPU_THRESHOLD,
                                   CRITICAL_DISK_THRESHOLD,
                                   CRITICAL_MEMORY_THRESHOLD, logger)

router = APIRouter()


@router.get("/alert-check")
async def alert_check():
    alerts = []

    cpu_usage = psutil.cpu_percent()
    if cpu_usage > CRITICAL_CPU_THRESHOLD:
        alert_msg = f"CRITICAL: CPU usage is {cpu_usage}%, which exceeds the threshold of {CRITICAL_CPU_THRESHOLD}%"
        alerts.append(alert_msg)
        logger.critical(alert_msg)

    memory_usage = psutil.virtual_memory().percent
    if memory_usage > CRITICAL_MEMORY_THRESHOLD:
        alert_msg = f"CRITICAL: Memory usage is {memory_usage}%, which exceeds the threshold of {CRITICAL_MEMORY_THRESHOLD}%"
        alerts.append(alert_msg)
        logger.critical(alert_msg)

    disk_usage = psutil.disk_usage("/").percent
    if disk_usage > CRITICAL_DISK_THRESHOLD:
        alert_msg = f"CRITICAL: Disk usage is {disk_usage}%, which exceeds the threshold of {CRITICAL_DISK_THRESHOLD}%"
        alerts.append(alert_msg)
        logger.critical(alert_msg)

    if alerts:
        return {"status": "CRITICAL", "alerts": alerts}

    return {"status": "OK", "message": "No critical alerts detected"}
