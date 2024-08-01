from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlmodel import Session
from sqlalchemy.exc import NoResultFound

from src.models.models import User
from src.services.auth_services import get_current_user
from src.services.todo_item_service import (
    TodoItem,
    create_db_todo_item,
    read_db_all_todo_items_of_user,
    update_db_todo_item,
    delete_db_todo_item,
)

from src.db.core import get_db

router = APIRouter(
    prefix="/items",
)


@router.get("/")
async def read_all_todo_items_of_user(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db),
) -> list:
    items = read_db_all_todo_items_of_user(user=current_user, session=db)

    return items


@router.post("/")
async def create_todo_item(
    current_user: Annotated[User, Depends(get_current_user)],
    item: TodoItem,
    db: Session = Depends(get_db),
) -> TodoItem:
    item.user_id = current_user.id
    item = create_db_todo_item(item, db)

    return item


@router.put("/{id}")
async def update_item(
    current_user: Annotated[User, Depends(get_current_user)],
    id: int,
    updated_item: TodoItem,
    db: Session = Depends(get_db),
) -> TodoItem:
    updated_item.user_id = current_user.id
    try:
        item = update_db_todo_item(id, updated_item, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"Item with id {id} not found")

    return item


@router.delete("/{id}")
async def delete_item(
    current_user: Annotated[User, Depends(get_current_user)],
    id: int,
    db: Session = Depends(get_db),
) -> TodoItem:
    try:
        item = delete_db_todo_item(id, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"Item with id {id} not found")

    return item
