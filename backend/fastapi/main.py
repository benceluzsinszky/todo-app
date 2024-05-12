from fastapi import FastAPI

from routers.items import router as items_router
import uvicorn

app = FastAPI()
app.include_router(items_router)


@app.get("/")
async def root():
    return {"message": "Server online"}


if __name__ == "__main__":
    uvicorn.run(app, port=8000)
