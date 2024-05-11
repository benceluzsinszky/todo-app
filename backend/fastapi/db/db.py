from sqlmodel import SQLModel, Session, Field, select, create_engine
from sqlalchemy.orm import sessionmaker
import os


class Item(SQLModel, table=True):
    __tablename__ = "items"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)
    name: str


def create_db_item(item: Item, session: Session) -> Item:
    session.add(item)
    session.commit()
    session.refresh(item)

    return item


def read_db_item(item_name: str, session: Session) -> Item:
    statement = select(Item).where(Item.name == item_name)
    results = session.exec(statement)
    item = results.one()

    return item


def read_db_all_items(session: Session) -> list:
    statement = select(Item)
    results = session.exec(statement)
    items = results.all()

    return items  # type: ignore


def update_db_item(item_name: str, updated_item: Item, session: Session) -> Item:
    db_item = read_db_item(item_name, session)
    for key, value in updated_item.model_dump(exclude_none=True).items():
        setattr(db_item, key, value)
    session.commit()
    session.refresh(db_item)

    return db_item


def delete_db_item(item_name: str, session: Session) -> Item:
    item = read_db_item(item_name, session)
    session.delete(item)
    session.commit()

    return item


# ---- core functions
DATABASE_URL = os.environ["DATABASE_URL"]
engine = create_engine(DATABASE_URL)
session_local = sessionmaker(
    class_=Session, autocommit=False, autoflush=False, bind=engine
)
SQLModel.metadata.create_all(bind=engine)


# Dependency to get the database session
def get_db():
    database = session_local()
    try:
        yield database
    finally:
        database.close()
