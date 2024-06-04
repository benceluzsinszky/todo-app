# Todo App

A todo app with React.ts frontend and FastAPI backend.
Various other backed framework implementations are planned.

## Getting Started

### Prerequisites

Node.js and npm are required to run the frontend. Python and pip are required to run the backend.

### Installing

```bash
pip install -r requirements.txt
npm install
cd frontend
npm install
```

#### Environment variables

```bash
export SECRET_KEY = "your secret key for JWT token hashing"
export ALGORITHM = "HS256"

export DATABASE_URL = "postgresql://user:password@host:port/database"

export VITE_BACKEND_URL = "http://your_backend_url:port"
```

>**Note:** The database URL must be accepted by [SQLAlchemy](https://docs.sqlalchemy.org/en/20/core/engines.html).

### Running

There is an npm script to run the frontend and backend together:

```bash
npm run fastapi
```

## Architecture

### Database Schema

```mermaid
erDiagram
    user 1--1+ todo_item : "has"
    user {
        int id
        string username
        string password
    }
    todo_item {
        int id
        int user_id
        string description
        bool completed
        datetime date_added
        datetime date_completed
    }
```

### Endpoints

The endpoints for the FastAPI are available at `/docs`.

#### Login

| Method | Path | Description |
| --- | --- | --- |
| POST | /token | Log in user |

#### User

| Method | Path | Description |
| --- | --- | --- |
| GET | /users/me | Get current user |
| POST | /users/ | Create new user |
| PUT | /users/me | Update current user |
| DELETE | /users/me | Delete current user |

#### Todo Item

| Method | Path | Description |
| --- | --- | --- |
| GET | /items/ | Get all todo items of current user |
| POST | /items/ | Create new todo item |
| PUT | /items/{id} | Update todo item |
| DELETE | /items/{id} | Delete todo item |
