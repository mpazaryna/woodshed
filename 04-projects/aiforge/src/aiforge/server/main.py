# main.py
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

from aiforge.server.routers import alert, health, response_generation

app = FastAPI()

app.include_router(health.router)
app.include_router(alert.router)
app.include_router(response_generation.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Your API",
        version="1.0.0",
        description="This is a very custom OpenAPI schema",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi  # type: ignore
