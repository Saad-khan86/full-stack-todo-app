from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlmodel import Session, select
from app.db import get_session
from app.models import User
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone

oauth_scheme = OAuth2PasswordBearer(tokenUrl="/login")

SECRET_KEY= "DhGBeri6bs1d58DT0AaVfLcSADG5P2OKM156qzahzjU"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def hash_password(password):
    return pwd_context.hash(password)

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

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "type": "access"})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    to_encode.update({"exp": expire, "type": "refresh"})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def current_user(token:Annotated[str, Depends(oauth_scheme)], session:Annotated[Session, Depends(get_session)]):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username = payload.get("sub")

        except:
             raise HTTPException(status_code=401)
    
        user = get_user_from_db(session, username)
        if not user:
           raise HTTPException(status_code=401)
        return user
