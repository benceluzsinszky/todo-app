from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from sqlalchemy.exc import NoResultFound

from db.db import (
    Item,
    create_db_item,
    read_db_item,
    read_db_all_items,
    update_db_item,
    delete_db_item,
    get_db,
)


router = APIRouter(
    prefix="/items",
)


@router.post("/")
async def create_item(item_name: str, db: Session = Depends(get_db)) -> Item:
    item = Item(name=item_name)
    item = create_db_item(item, db)

    return item


@router.get("/all")
async def read_all_items(db: Session = Depends(get_db)) -> list:
    items = read_db_all_items(db)
    if not items:
        raise HTTPException(status_code=404, detail="No items in DB")

    return items


@router.get("/{item_name}")
async def read_item(item_name: str, db: Session = Depends(get_db)) -> Item:
    try:
        item = read_db_item(item_name, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"{item_name} not found")

    return item


@router.put("/{item_name}")
async def update_item(
    item_name: str, new_item_name: str, db: Session = Depends(get_db)
) -> Item:
    updated_item = Item(name=new_item_name)
    try:
        item = update_db_item(item_name, updated_item, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"{item_name} not found")

    return item


@router.delete("/{item_name}")
async def delete_item(item_name: str, db: Session = Depends(get_db)) -> Item:
    try:
        item = delete_db_item(item_name, db)
    except NoResultFound:
        raise HTTPException(status_code=404, detail=f"{item_name} not found")

    return item
