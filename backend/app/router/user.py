from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.models import Register_User
from app.db import get_session


user_router: APIRouter = APIRouter(
    prefix='/user',
    tags=['uesr'],
    responses={404: {"description": "Not found"}}
)

@user_router.get("/")
async def user_page():
    return {"wellcome to user page"}


@user_router.post("/register")
async def register_user(FromData: Annotated[Register_User, Depends()], sesseion: Annotated[Session, Depends(get_session)]):
    pass