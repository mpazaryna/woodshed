import psutil
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/health", response_class=JSONResponse)
async def health_check() -> dict:
    """
    Health check endpoint to verify server status.

    Returns:
        dict: Dictionary containing the status of the server.
    """
    return {"status": "ok"}


@router.get("/utilization", response_class=JSONResponse)
async def server_utilization() -> dict:
    """
    Endpoint to evaluate server utilization.

    Returns:
        dict: Dictionary containing CPU and memory utilization.
    """
    cpu_usage = psutil.cpu_percent(interval=1)
    memory_info = psutil.virtual_memory()
    return {
        "cpu_usage": cpu_usage,
        "memory_usage": memory_info.percent,
        "total_memory": memory_info.total,
        "available_memory": memory_info.available,
    }
