from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])

def hash_password(password: str):

    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):

    return pwd_context.verify(plain_password, hashed_password)

# from passlib.context import CryptContext

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# hashed = pwd_context.hash("123456")
# print(hashed)
# print(pwd_context.verify("123456", hashed))