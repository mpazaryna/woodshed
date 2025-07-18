from fastapi import FastAPI

from trading_kit_fastapi.api.analyze_stock_trends import (
    router as analyze_stock_trends_router,
)
from trading_kit_fastapi.core.about import router as about_router
from trading_kit_fastapi.core.health import router as health_router

app = FastAPI()

# Include the routers
app.include_router(about_router)
app.include_router(analyze_stock_trends_router)
app.include_router(health_router)


@app.get("/")
async def root():
    return {"message": "Welcome to the Stock Trend Analysis API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
