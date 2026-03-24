from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import JWT_Token, Register_User, User
from app.db import get_session
from app.auth import create_access_token, create_refresh_token, current_user, get_user_from_db, hash_password
    
user_router: APIRouter = APIRouter(
    prefix='/user',
    tags=['user'],
    responses={404: {"description": "Not found"}}
)

@user_router.get("/")
async def user_page():
    return {"wellcome to user page"}

@user_router.post("/register", response_model=JWT_Token)
async def register_user(new_user: Register_User, session: Annotated[Session, Depends(get_session)]):

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

    access_token = create_access_token({"sub": new_user.username})
    refresh_token = create_refresh_token({"sub": new_user.username})
    
    return JWT_Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )
    # return {"message": f""" User with {new_user.username} successfully registered """}

@user_router.get("/profile")
async def user_profile(session:Annotated[Session, Depends(get_session)], current_user: Annotated[User, Depends(current_user)]):
    user = get_user_from_db(session, current_user.username)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    return user