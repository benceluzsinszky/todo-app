from fastapi import FastAPI

from fastapi.testclient import TestClient
import pytest
from sqlmodel import SQLModel, create_engine, StaticPool, Session
from sqlalchemy.orm import sessionmaker

from routers.items import router as items_router
from db.core import get_db


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


@pytest.fixture(autouse=True)
def run_before_and_after_tests():
    """Fixture to execute asserts before and after a test is run"""
    # Setup
    SQLModel.metadata.create_all(bind=engine)

    yield  # this is where the testing happens

    # Teardown
    SQLModel.metadata.drop_all(bind=engine)


@pytest.fixture
def test_item():
    # Arrange
    response = client.post("/items/", json={"description": "testItem"})
    return response.json()


@pytest.fixture
def test_item2():
    # Arrange
    response = client.post("/items/", json={"description": "testItem2"})
    return response.json()


class TestAPI:
    def test_create_item_shouldreturnitemwhenitemiscreated(self):
        # Act
        response = client.post("/items/", json={"description": "testItem"})
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["description"] == "testItem"
        assert "id" in data

    def test_read_all_items_shouldreturn2itemswhen2itemsindb(
        self, test_item, test_item2
    ):
        # Act
        response = client.get("/items/")
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert len(data) == 2
        assert data[0]["description"] == test_item["description"]
        assert data[0]["id"] == test_item["id"]
        assert data[1]["description"] == test_item2["description"]
        assert data[1]["id"] == test_item2["id"]

    def test_read_all_items_shouldreturnerrorwhennoitemsindb(self):
        # Act
        response = client.get("/items/")
        # Assert
        assert response.status_code == 404
        assert response.text == '{"detail":"No items in DB"}'

    def test_read_item_shouldreturnitemwhenitemiscreated(self, test_item):
        # Act
        response = client.get(f"/items/{test_item['id']}")
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["description"] == test_item["description"]
        assert data["id"] == test_item["id"]

    def test_read_item_shouldreturnerrorwhenitemisnotindb(self):
        # Act
        response = client.get("/items/1")
        # Assert
        assert response.status_code == 404, response.text
        assert response.text == '{"detail":"Item with id 1 not found"}'

    def test_update_item_shouldreturnitemwithupdateddescription(self, test_item):
        # Act
        response = client.put(
            "/items/1",
            json={"description": "updatedItem"},
        )
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["description"] == "updatedItem"
        assert data["id"] == test_item["id"]

    def test_update_item_shouldreturncompleteditemwhenitemiscompleted(self, test_item):
        # Act
        response = client.put(
            "/items/1",
            json={"completed": True},
        )
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["completed"] is True
        assert data["id"] == test_item["id"]
        assert data["date_completed"] is not None

    def test_update_item_shouldreturnerrorwhenitemisnotindb(self):
        # Act
        response = client.put(
            "/items/1",
            json={"new_item_name": "updatedItem"},
        )
        # Assert
        assert response.status_code == 404, response.text
        assert response.text == '{"detail":"Item with id 1 not found"}'

    def test_delete_item_shouldreturnitemwhenitemisdeleted(self, test_item):
        # Act
        response = client.delete(f"/items/{test_item['id']}")
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["id"] == test_item["id"]
        # Try to get the deleted item
        response = client.get(f"/items/{test_item['id']}")
        assert response.status_code == 404, response.text
        assert (
            response.text == f'{{"detail":"Item with id {test_item["id"]} not found"}}'
        )

    def test_delete_item_shouldraiseerrorwhenitemisnotindb(self):
        # Act
        response = client.delete("/items/1")
        # Assert
        assert response.status_code == 404, response.text
        assert response.text == '{"detail":"Item with id 1 not found"}'
