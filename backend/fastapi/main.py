from fastapi import FastAPI

from src.routers.auth_router import router as auth_router
from src.routers.items_router import router as items_router
from src.routers.users_router import router as users_router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()
app.include_router(auth_router)
app.include_router(items_router)
app.include_router(users_router)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Server online"}


if __name__ == "__main__":
    uvicorn.run(app, port=8000)
