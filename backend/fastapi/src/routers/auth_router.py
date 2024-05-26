from datetime import timedelta
from sqlalchemy.exc import NoResultFound
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, APIRouter, HTTPException, status
from sqlmodel import Session
from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError

from src.models.models import Token, User, TokenData
from src.auth.auth import (
    verify_password,
    create_access_token,
    oauth2_scheme,
    SECRET_KEY,
    ALGORITHM,
)
from src.services.user_service import read_db_user
from src.db.core import get_db

ACCES_TOKEN_EXPIRE_MINUTES = 30


def authenticate_user(db: Session, username: str, password: str):
    try:
        user = read_db_user(username=username, session=db)
    except NoResultFound:
        return False
    if not verify_password(password, user.password):
        return False

    return user


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
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


router = APIRouter()


@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
) -> Token:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(ACCES_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")


@router.get("/users/me")
async def read_current_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user
