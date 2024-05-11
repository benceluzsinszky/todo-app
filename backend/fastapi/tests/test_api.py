import os
from fastapi import FastAPI

from fastapi.testclient import TestClient
import pytest
from sqlmodel import SQLModel, create_engine, StaticPool, Session
from sqlalchemy.orm import sessionmaker

os.environ[
    "DATABASE_URL"
] = "sqlite:///:memory:"  # must use environment variable for db

from routers.items import router as items_router  # noqa: E402
from db.db import get_db  # noqa: E402


app = FastAPI()
app.include_router(items_router)


client = TestClient(app)

# # Setup the in-memory SQLite database for testing
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False,
    },
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    class_=Session, autocommit=False, autoflush=False, bind=engine
)


# Dependency to override the get_db dependency in the main app
def override_get_db():
    database = TestingSessionLocal()
    yield database
    database.close()


app.dependency_overrides[get_db] = override_get_db


def test_create_item():
    response = client.post("/items/", params={"item_name": "testItem"})
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "testItem"
    assert "id" in data


def test_read_all_items_with_empty_db():
    response = client.get("/items/all")
    assert response.status_code == 404, response.text


def test_read_all_items():
    # Create an item
    item_name = "testItem"
    response = client.post("/items/", params={"item_name": item_name})
    data = response.json()
    item_id = data["id"]

    response = client.get("/items/all")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data[0]["name"] == item_name
    assert data[0]["id"] == item_id


def test_read_item():
    # Create an item
    item_name = "testItem"
    response = client.post("/items/", params={"item_name": item_name})
    data = response.json()
    item_id = data["id"]

    response = client.get(f"/items/{item_name}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == item_name
    assert data["id"] == item_id


def test_update_item():
    # Create an item
    item_name = "testItem"
    response = client.post("/items/", params={"item_name": item_name})
    data = response.json()
    item_id = data["id"]

    response = client.put(
        f"/items/{item_name}",
        params={"new_item_name": "updatedItem"},
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "updatedItem"
    assert data["id"] == item_id


def test_update_item_with_nonexistent_item():
    item_name = "testItem"
    response = client.put(
        f"/items/{item_name}",
        params={"new_item_name": "updatedItem"},
    )
    assert response.status_code == 404, response.text


def test_delete_item():
    item_name = "testItem"
    response = client.post("/items/", params={"item_name": item_name})
    data = response.json()
    item_id = data["id"]

    response = client.delete(f"/items/{item_name}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == item_id
    # Try to get the deleted item
    response = client.get(f"/items/{item_name}")
    assert response.status_code == 404, response.text


def test_delete_item_with_nonexistent_item():
    item_name = "testItem"
    response = client.delete(f"/items/{item_name}")
    assert response.status_code == 404, response.text


@pytest.fixture(autouse=True)
def run_before_and_after_tests():
    """Fixture to execute asserts before and after a test is run"""
    # Setup
    SQLModel.metadata.create_all(bind=engine)

    yield  # this is where the testing happens

    # Teardown
    SQLModel.metadata.drop_all(bind=engine)
