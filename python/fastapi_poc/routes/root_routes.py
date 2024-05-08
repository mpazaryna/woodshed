# routes/root_routes.py
from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/")
def read_root():
    return {"Hello": "World"}
