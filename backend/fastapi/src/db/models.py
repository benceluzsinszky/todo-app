from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True)
    password: str = Field()

    todo_items: list["TodoItem"] = Relationship(back_populates="user")


class TodoItem(SQLModel, table=True):
    __tablename__ = "todo_item"

    id: int | None = Field(default=None, primary_key=True)
    description: str
    date_added: datetime = Field(default=datetime.now(timezone.utc))
    date_completed: datetime | None = None
    completed: bool = False

    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="todo_items")
