from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.db import create_tables, get_session
from app.models import Create_Todo, JWT_Token, RefreshRequest, Todo, User
from app.router.user import user_router
from app.auth import authenticate_user, create_access_token, current_user, get_user_from_db, create_refresh_token
from jose import jwt, JWTError
from app.auth import SECRET_KEY, ALGORITHM

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(lifespan=lifespan, title='My First Todo App', version='1.0.0')

app.include_router(router=user_router)

@app.get("/")
def home():
    return {"message":"wellcome to daily todo app"}

@app.post("/login", response_model= JWT_Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):

    user = authenticate_user(form_data.username, form_data.password, session)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.username})
    refresh_token = create_refresh_token({"sub": user.username})

    return JWT_Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@app.post("/refresh")
def refresh_token(data: RefreshRequest):
    refresh_token = data.refresh_token

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401)

        username = payload.get("sub")

    except:
        raise HTTPException(status_code=401)

    new_access_token = create_access_token({"sub": username})

    return {
        "access_token": new_access_token
    }

@app.post("/todos", response_model=Todo)
async def create_todo(current_user: Annotated[User, Depends(current_user)], todo:Create_Todo, session:Annotated[Session, Depends(get_session)]):
    new_todo: Todo = Todo(content=todo.content, user_id=current_user.id)
    new_todo.id = None
    session.add(new_todo)
    session.commit()
    session.refresh(new_todo)
    return new_todo

@app.get("/todos", response_model=list[Todo])
async def get_all_todos(session:Annotated[Session, Depends(get_session)], current_user: Annotated[User, Depends(current_user)]):
    todos = session.exec(select(Todo).where(Todo.user_id == current_user.id)).all()
    
    if not todos:
        raise HTTPException(status_code=404, detail="Todos not found")
    return todos

@app.get("/todos/{id}", response_model=Todo)
async def get_single_todo(id:int, session:Annotated[Session, Depends(get_session)], current_user: Annotated[User, Depends(current_user)]):
    user_todo: Todo = session.exec(select(Todo).where(Todo.user_id == current_user.id)).all()
    mathed_todo = next((todo for todo in user_todo if todo.id == id ), None)
    if not mathed_todo:
        raise HTTPException(status_code=404, detail="Task not found")
    return mathed_todo

@app.put("/todos/{id}")
async def edit_todo(todo:Todo, id:int, session:Annotated[Session, Depends(get_session)], current_user: Annotated[User, Depends(current_user)]):
    user_todo: Todo = session.exec(select(Todo).where(Todo.user_id == current_user.id)).all()
    existing_todo = next((todo for todo in user_todo if todo.id == id ), None)

    if existing_todo:
        existing_todo.content = todo.content
        existing_todo.is_completed = todo.is_completed
        session.add(existing_todo)
        session.commit()
        session.refresh(existing_todo)
    else:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return existing_todo


@app.delete("/todos/{id}")
async def delete_todo(id:int, session:Annotated[Session, Depends(get_session)], current_user: Annotated[User, Depends(current_user)]):
    user_todo: Todo = session.exec(select(Todo).where(Todo.user_id == current_user.id)).all()
    todo = next((todo for todo in user_todo if todo.id == id ), None)
    if todo:
        session.delete(todo)
        session.commit()
        return {"message" : "task sucessfully deleted"}
    else:
        raise HTTPException(status_code=404, detail="Task not found")
