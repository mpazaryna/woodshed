# routes/add_routes.py

from fastapi import APIRouter, Depends

from agents.add.adder import add_two_numbers
from dependencies.api_key_dependency import check_custom_api_key

from .models import AddNumbers

router = APIRouter()


@router.post("/add")
async def add(number1: float, number2: float):
    return {"result": add_two_numbers(number1, number2)}


@router.post("/v1/add", dependencies=[Depends(check_custom_api_key)])
async def add_v1(add_numbers: AddNumbers):
    return {"result": add_two_numbers(add_numbers.number1, add_numbers.number2)}
