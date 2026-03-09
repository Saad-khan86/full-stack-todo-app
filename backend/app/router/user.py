from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import Register_User, User
from app.db import get_session
from app.auth import hash_password


user_router: APIRouter = APIRouter(
    prefix='/user',
    tags=['uesr'],
    responses={404: {"description": "Not found"}}
)

@user_router.get("/")
async def user_page():
    return {"wellcome to user page"}

@user_router.post("/register")
async def register_user(FromData: Annotated[Register_User, Depends()], session: Annotated[Session, Depends(get_session)]):
    user = session.exec(select(User).where(User.email == FromData.email)).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
    username = FromData.username,
    email = FromData.email,
    password = hash_password(FromData.password)
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User created"}