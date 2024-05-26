import jwt
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, UTC
from sqlalchemy.exc import NoResultFound
from sqlmodel import Session
from fastapi import HTTPException, status, Depends
from typing import Annotated

from src.constants import SECRET_KEY, ALGORITHM, OAUTH2_SCHEME, PWD_CONTEXT

from src.models.models import User, TokenData
from src.services.user_service import read_db_user
from src.db.core import get_db


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return PWD_CONTEXT.verify(plain_password, hashed_password)


def authenticate_user(db: Session, username: str, password: str):
    try:
        user = read_db_user(username=username, session=db)
    except NoResultFound:
        return False
    if not verify_password(password, user.password):
        return False

    return user


async def get_current_user(
    token: Annotated[str, Depends(OAUTH2_SCHEME)], db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    try:
        user = read_db_user(username=token_data.username, session=db)
    except NoResultFound:
        raise credentials_exception

    return user
