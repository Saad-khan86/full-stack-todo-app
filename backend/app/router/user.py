from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import Register_User, User
from app.db import get_session
from app.auth import hash_password
    
user_router: APIRouter = APIRouter(
    prefix='/user',
    tags=['user'],
    responses={404: {"description": "Not found"}}
)

@user_router.get("/")
async def user_page():
    return {"wellcome to user page"}

@user_router.post("/register")
async def register_user(new_user: Annotated[Register_User, Depends()], session: Annotated[Session, Depends(get_session)]):

    user_with_username = session.exec(select(User).where(User.username == new_user.username)).first()
    if user_with_username:
        raise HTTPException(status_code=409, detail="User with these username already exists")
    
    user_with_email= session.exec(select(User).where(User.email == new_user.email)).first()
    if user_with_email:
        raise HTTPException(status_code=409, detail="User with these email already exists")
    
    new_user = User(
    username = new_user.username,
    email = new_user.email,
    password = hash_password(new_user.password) 
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": f""" User with {new_user.username} successfully registered """}