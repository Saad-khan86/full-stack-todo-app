from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.db import create_tables, get_session
from app.models import JWT_Token, Todo, User
from app.router.user import user_router
from app.auth import authenticate_user, create_access_token, verify_password
 
@asynccontextmanager
async def lifespan(app: FastAPI):
    print('Creating Tables')
    create_tables()
    print("Tables Created")
    yield

app = FastAPI(lifespan=lifespan, title='My First Todo App', version='1.0.0')

app.include_router(router=user_router)

@app.get("/")
def home():
    return {"message":"wellcome to daily todo app"}

@app.post("/login", response_model= JWT_Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session:Annotated[Session, Depends(get_session)]):
    user = authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = create_access_token({"sub":form_data.username})
    return JWT_Token(access_token=access_token, token_type="bearer")


@app.post("/todos", response_model=Todo)
async def create_todo(todo:Todo, session:Annotated[Session, Depends(get_session)]):
    todo.id = None
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo

@app.get("/todos", response_model=list[Todo])
async def get_all_todos(session:Annotated[Session, Depends(get_session)]):
    todos = session.exec(select(Todo)).all()
    if not todos:
        raise HTTPException(status_code=404, detail="Todos not found")
    return todos

@app.get("/todos/{id}", response_model=Todo)
async def get_single_todo(id:int, session:Annotated[Session, Depends(get_session)]):
    single_todo: Todo = session.exec(select(Todo).where(Todo.id == id)).first()
    if not single_todo:
        raise HTTPException(status_code=404, detail="Task not found")
    return single_todo

@app.put("/todos/{id}")
async def edit_todo(todo:Todo, id:int, session:Annotated[Session, Depends(get_session)]):
    existing_todo: Todo = session.exec(select(Todo).where(Todo.id == id)).first()
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
async def delete_todo(id:int, session:Annotated[Session, Depends(get_session)]):
    todo: Todo = session.exec(select(Todo).where(Todo.id == id)).first()
    if todo:
        session.delete(todo)
        session.commit()
        return {"message" : "task sucessfully deleted"}
    else:
        raise HTTPException(status_code=404, detail="Task not found")
