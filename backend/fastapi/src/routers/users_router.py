from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from sqlalchemy.exc import NoResultFound, IntegrityError


from src.services.auth_services import get_current_user
from src.services.user_service import (
    User,
    create_db_user,
    update_db_user,
    delete_db_user,
)

from src.db.core import get_db

router = APIRouter(
    prefix="/users",
)


@router.get("/me")
async def read_current_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> str:
    return current_user.username


@router.post("/")
async def create_user(user: User, db: Session = Depends(get_db)) -> User:
    try:
        user = create_db_user(user, db)
    except IntegrityError:
        raise HTTPException(status_code=409, detail="User already exists")

    return user


@router.put("/me")
async def update_User(
    current_user: Annotated[User, Depends(get_current_user)],
    updated_user: User,
    db: Session = Depends(get_db),
) -> User:
    user_id = current_user.id
    try:
        user = update_db_user(user_id, updated_user, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")

    return user


@router.delete("/me")
async def delete_user(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
) -> User:
    try:
        user = delete_db_user(current_user.id, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"User with id {id} not found")

    return user
