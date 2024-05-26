from sqlalchemy.exc import NoResultFound
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, APIRouter, HTTPException
from sqlmodel import Session
from typing import Annotated

from src.auth.auth import verify_password
from src.services.user_service import read_db_user
from src.db.core import get_db

router = APIRouter()


@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    try:
        user = read_db_user(username=form_data.username, session=db)
    except NoResultFound:
        raise HTTPException(status_code=400, detail="Incorrect username")
    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    return {"access_token": user.username, "token_type": "bearer"}
