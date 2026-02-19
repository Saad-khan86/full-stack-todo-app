from starlette.config import Config
from starlette.datastructures import Secret

try:
    config = Config(".env")
    DATABASE_URL = config("DATABASE_URL", case=Secret)
    
except:
    config = Config()