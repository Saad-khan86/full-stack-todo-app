from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import Register_User, User
from app.db import get_session
from app.auth import current_user, get_user_from_db, hash_password
    
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

    user = get_user_from_db(session, new_user.username, new_user.email) 

    if user:
        raise HTTPException(status_code=409, detail="User with these credentials already exists")
    
    new_user = User(
    username = new_user.username,
    email = new_user.email,
    password = hash_password(new_user.password) 
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": f""" User with {new_user.username} successfully registered """}

@user_router.get("/profile")
async def user_profile(session:Annotated[Session, Depends(get_session)], current_user: Annotated[User, Depends(current_user)]):
    user = get_user_from_db(session, current_user.username)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    return user