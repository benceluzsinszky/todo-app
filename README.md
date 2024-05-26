# Todo App

A todo app with React frontend and FastAPI backend.
Various other backed framework implementations are planned.

The app is using OAuth2 Bearer token for user authentication.

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
