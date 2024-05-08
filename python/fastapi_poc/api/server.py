# server.py

from fastapi import FastAPI

from routes.add_routes import router as add_router
from routes.fema_routes import router as fema_router
from routes.root_routes import router as root_router

app = FastAPI()

app.include_router(add_router)
app.include_router(root_router)
app.include_router(fema_router)
