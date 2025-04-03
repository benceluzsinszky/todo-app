# Todo App

A todo app with React.ts frontend and various backend frameworks.

Currently implemented backends:

- FastAPI
- ExpressJS

Planned backend:

- Go Standard Library
- .Net

## Getting Started

### Prerequisites

Node.js and npm are required to run the frontend. Python and pip are required to run the backend.

### Installing

```bash
npm install
cd frontend
npm install
```

For FastAPI:

```bash
pip install -r requirements.txt
```

For ExpressJS:

```bash
cd .\backend\be_expressjs\
```

#### Environment variables

```bash
export SECRET_KEY = "your secret key for JWT token hashing"
export ALGORITHM = "HS256"

export DATABASE_URL = "postgresql://user:password@host:port/database"

export VITE_BACKEND_URL = "http://your_backend_url:port"
```

### Running

There are npm scripts to run the frontend and backend concurrently:

FastAPI:

```bash
npm run fastapi
```

ExpressJS:

```bash
npm run expressjs
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

The endpoints are available via Swagger UI with the FastAPI backend on `/docs` endpoint.

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
