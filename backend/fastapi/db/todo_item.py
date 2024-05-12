from sqlmodel import SQLModel, Session, Field, select
from datetime import datetime, timezone


class TodoItem(SQLModel, table=True):
    __tablename__ = "todo_item"

    id: int | None = Field(default=None, primary_key=True)
    description: str
    date_added: datetime = Field(default=datetime.now(timezone.utc))
    date_completed: datetime | None = None
    completed: bool = False


def create_db_todo_item(item: TodoItem, session: Session) -> TodoItem:
    session.add(item)
    session.commit()
    session.refresh(item)

    return item


def read_db_todo_item(id: int, session: Session) -> TodoItem:
    statement = select(TodoItem).where(TodoItem.id == id)
    results = session.exec(statement)
    item = results.one()

    return item


def read_db_all_todo_items(session: Session) -> list:
    statement = select(TodoItem)
    results = session.exec(statement)
    items = results.all()

    return items


def update_db_todo_item(id: int, updated_item: TodoItem, session: Session) -> TodoItem:
    print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdfagfdsfghfs")

    item = read_db_todo_item(id, session)
    print(item)
    print(updated_item)
    if not item.completed and updated_item.completed:
        updated_item.date_completed = datetime.now(timezone.utc)
    for key, value in updated_item.model_dump(exclude_none=True).items():
        setattr(item, key, value)
    session.commit()
    session.refresh(item)

    return item


def delete_db_todo_item(id: int, session: Session) -> TodoItem:
    item = read_db_todo_item(id, session)
    session.delete(item)
    session.commit()

    return item
