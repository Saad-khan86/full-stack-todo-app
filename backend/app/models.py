from typing import Annotated
from fastapi import Form
from pydantic import BaseModel
from sqlmodel import Field, SQLModel

class Todo(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    content : str = Field(index=True, min_length=3, max_length=50)
    is_completed: bool = Field(default=False)
    user_id: int = Field(foreign_key="user.id")

class Create_Todo(BaseModel):
    content : str = Field(index=True, min_length=3, max_length=50)

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str 
    email: str 
    password: str   

class Register_User (BaseModel):
    username: str
    email: str
    password: str

class JWT_Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class RefreshRequest(BaseModel):
    refresh_token: str