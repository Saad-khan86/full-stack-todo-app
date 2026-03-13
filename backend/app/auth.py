from typing import Annotated
from fastapi import Depends
from passlib.context import CryptContext
from sqlmodel import Session, select
from app.db import get_session
from app.models import User
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone

SECRET_KEY= "DhGBeri6bs1d58DT0AaVfLcSADG5P2OKM156qzahzjU"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"])

def hash_password(password: str):

    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):

    return pwd_context.verify(plain_password, hashed_password)

def get_user_from_db(session: Annotated[Session, Depends(get_session)], username: str | None = None, email: str | None = None):

    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        user = session.exec(select(User).where(User.email == email)).first()
        if user:
            return user

    return user

def authenticate_user(username, password, session: Annotated[Session, Depends(get_session)]):

    db_user = get_user_from_db(session=session, username=username)
    if not db_user:
        return False
    if not verify_password(password, db_user.password):
        return False
    return db_user

def create_access_token(data:dict):
    data_to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    data_to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(data_to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt