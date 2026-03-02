from sqlmodel import SQLModel, Session, create_engine

from app.settings import DATABASE_URL


connection_string: str =str(DATABASE_URL).replace('postgresql', 'postgresql+psycopg2' )
engine = create_engine(connection_string, connect_args={"sslmode" :"require"}, pool_recycle=300, pool_size=10, echo=True)

def create_tables(): 
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session