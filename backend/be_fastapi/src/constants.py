from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.environ["DATABASE_URL"]

SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = os.environ["HASHING_ALGORITHM"]

ACCES_TOKEN_EXPIRE_MINUTES = 30

OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="token")
PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")
