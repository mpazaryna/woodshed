from fastapi import APIRouter

router = APIRouter()


@router.get("/about")
async def get_about():
    return {"message": "This is the Trading Kit FastAPI application."}


@router.post("/about")
async def post_about(info: dict):
    return {"received_info": info}
