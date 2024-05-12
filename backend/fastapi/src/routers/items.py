from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from sqlalchemy.exc import NoResultFound

from src.db.todo_item import (
    TodoItem,
    create_db_todo_item,
    read_db_todo_item,
    read_db_all_todo_items,
    update_db_todo_item,
    delete_db_todo_item,
)

from src.db.core import get_db

router = APIRouter(
    prefix="/items",
)


@router.post("/")
async def create_todo_item(item: TodoItem, db: Session = Depends(get_db)) -> TodoItem:
    item = create_db_todo_item(item, db)

    return item


@router.get("/")
async def read_all_todo_items(db: Session = Depends(get_db)) -> list:
    items = read_db_all_todo_items(db)
    if not items:
        raise HTTPException(status_code=404, detail="No items in DB")

    return items


@router.get("/{id}")
async def read_item(id: int, db: Session = Depends(get_db)) -> TodoItem:
    try:
        item = read_db_todo_item(id, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"Item with id {id} not found")

    return item


@router.put("/{id}")
async def update_item(
    id: int, updated_item: TodoItem, db: Session = Depends(get_db)
) -> TodoItem:
    try:
        item = update_db_todo_item(id, updated_item, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"Item with id {id} not found")

    return item


@router.delete("/{id}")
async def delete_item(id: int, db: Session = Depends(get_db)) -> TodoItem:
    try:
        item = delete_db_todo_item(id, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"Item with id {id} not found")

    return item
