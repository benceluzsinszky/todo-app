from fastapi import FastAPI

from fastapi.testclient import TestClient
import pytest
from sqlmodel import SQLModel, create_engine, StaticPool, Session
from sqlalchemy.orm import sessionmaker

from src.routers.auth_router import router as auth_router
from src.routers.items_router import router as items_router
from src.routers.users_router import router as users_router
from src.db.core import get_db


app = FastAPI()
app.include_router(auth_router)
app.include_router(items_router)
app.include_router(users_router)


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
def test_user():
    # Arrange
    response = client.post("/users/", json={"username": "test", "password": "test"})
    return response.json()


@pytest.fixture
def authenticated_client():
    """Fixture to authenticate a client"""
    auth_client = TestClient(app)
    auth_client.post("/users/", json={"username": "test", "password": "test"})
    response = auth_client.post("/token", data={"username": "test", "password": "test"})

    token = response.json()["access_token"]
    auth_client.headers = {
        **auth_client.headers,
        "Authorization": f"Bearer {token}",
    }

    return auth_client


@pytest.fixture
def test_item(authenticated_client):
    # Arrange
    response = authenticated_client.post("/items/", json={"description": "testItem"})
    return response.json()


@pytest.fixture
def test_item2(authenticated_client):
    # Arrange
    response = authenticated_client.post("/items/", json={"description": "testItem2"})
    return response.json()


class TestAuthRouter:
    def test_login_shouldreturntokenwhenuserisauthenticated(self, test_user):
        # Act
        response = client.post("/token", data={"username": "test", "password": "test"})
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_shouldreturnerrorwhenuserdoesnotexist(self, test_user):
        # Act
        response = client.post("/token", data={"username": "wrong", "password": "test"})
        # Assert
        assert response.status_code == 401, response.text
        assert response.text == '{"detail":"Incorrect username or password"}'

    def test_login_shouldreturnerrorwhenpasswordiswrong(self, test_user):
        # Act
        response = client.post("/token", data={"username": "test", "password": "wrong"})
        # Assert
        assert response.status_code == 401, response.text
        assert response.text == '{"detail":"Incorrect username or password"}'


class TestUsersRouter:
    def test_create_user_shouldreturnuserwhenuseriscreated(self):
        # Act
        response = client.post("/users/", json={"username": "test", "password": "test"})
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["username"] == "test"

    def test_create_user_shouldreturnerrorwhenuseralreadyexists(self, test_user):
        # Act
        response = client.post("/users/", json={"username": "test", "password": "test"})
        # Assert
        assert response.status_code == 409, response.text
        assert response.text == '{"detail":"User already exists"}'

    def test_create_user_shouldreturnerrorwhenusernameisempty(self):
        # Act
        response = client.post("/users/", json={"username": "", "password": "test"})
        # Assert
        assert response.status_code == 400, response.text
        assert response.text == '{"detail":"Username and password required"}'

    def test_create_user_shouldreturnerrorwhenpasswordisempty(self):
        # Act
        response = client.post("/users/", json={"username": "test", "password": ""})
        # Assert
        assert response.status_code == 400, response.text
        assert response.text == '{"detail":"Username and password required"}'

    def test_read_current_user_shouldreturnuserwhenuserexists(
        self, test_user, authenticated_client
    ):
        # Act
        response = authenticated_client.get("/users/me")
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["username"] == "test"

    def test_read_current_user_shouldreturnerrorwhenuserisnotauthenticated(self):
        # Arrange
        response = client.post("/users/", json={"username": "test", "password": "test"})
        # Act
        response = client.get("/users/me")
        # Assert
        assert response.status_code == 401, response.text
        assert response.text == '{"detail":"Not authenticated"}'

    def test_read_current_user_shouldreturnerrorwhentokeniswrong(self, test_user):
        # Arrange
        wrong_token = "wrongtoken"
        client.headers = {
            **client.headers,
            "Authorization": f"Bearer {wrong_token}",
        }
        # Act
        response = client.get("/users/me")
        # Assert
        assert response.status_code == 401, response.text
        assert response.text == '{"detail":"Could not validate credentials"}'

    def test_update_user_shouldreturnuserwithupdatedusername(
        self, test_user, authenticated_client
    ):
        # Act
        response = authenticated_client.put("/users/me", json={"username": "updated"})
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["username"] == "updated"

    def test_delete_user_shouldreturnuserwhenuserisdeleted(
        self, test_user, authenticated_client
    ):
        # Act
        response = authenticated_client.delete("/users/me")
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["username"] == "test"
        # Try to get the deleted user
        response = authenticated_client.get("/users/me")
        assert response.status_code == 401, response.text
        assert response.text == '{"detail":"Could not validate credentials"}'


class TestItemsRouter:
    def test_create_item_shouldreturnitemwhenitemiscreated(self, authenticated_client):
        # Act
        response = authenticated_client.post(
            "/items/", json={"description": "testItem"}
        )
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["description"] == "testItem"
        assert "id" in data

    def test_read_all_items_shouldreturn2itemswhen2itemsindb(
        self, test_item, test_item2, authenticated_client
    ):
        # Act
        response = authenticated_client.get("/items/")
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert len(data) == 2
        assert data[0]["description"] == test_item["description"]
        assert data[0]["id"] == test_item["id"]
        assert data[1]["description"] == test_item2["description"]
        assert data[1]["id"] == test_item2["id"]

    def test_read_all_items_shouldreturnerrorwhennoitemsindb(
        self, authenticated_client
    ):
        # Act
        response = authenticated_client.get("/items/")
        # Assert
        assert response.status_code == 404
        assert response.text == '{"detail":"No items in DB"}'

    def test_update_item_shouldreturnitemwithupdateddescription(
        self, test_item, authenticated_client
    ):
        # Act
        response = authenticated_client.put(
            "/items/1",
            json={"description": "updatedItem"},
        )
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["description"] == "updatedItem"
        assert data["id"] == test_item["id"]

    def test_update_item_shouldreturncompleteditemwhenitemiscompleted(
        self, test_item, authenticated_client
    ):
        # Act
        response = authenticated_client.put(
            "/items/1",
            json={"completed": True},
        )
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["completed"] is True
        assert data["id"] == test_item["id"]
        assert data["date_completed"] is not None

    def test_update_item_shouldreturnerrorwhenitemisnotindb(self, authenticated_client):
        # Act
        response = authenticated_client.put(
            "/items/1",
            json={"new_item_name": "updatedItem"},
        )
        # Assert
        assert response.status_code == 404, response.text
        assert response.text == '{"detail":"Item with id 1 not found"}'

    def test_delete_item_shouldreturnitemwhenitemisdeleted(
        self, test_item, authenticated_client
    ):
        # Act
        response = authenticated_client.delete(f"/items/{test_item['id']}")
        # Assert
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["id"] == test_item["id"]
        # Try to get the deleted item
        response = authenticated_client.get("/items/")
        assert response.status_code == 404, response.text
        assert response.text == '{"detail":"No items in DB"}'

    def test_delete_item_shouldraiseerrorwhenitemisnotindb(self, authenticated_client):
        # Act
        response = authenticated_client.delete("/items/1")
        # Assert
        assert response.status_code == 404, response.text
        assert response.text == '{"detail":"Item with id 1 not found"}'
