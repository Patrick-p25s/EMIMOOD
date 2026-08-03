from fastapi import FastAPI
from app.core.config import setting
from app.users.router import router as user_router
from app.auth.router import router as auth_router

app = FastAPI()


@app.get("/")
def index():
    return {"message": setting.DATABASE_URL}


app.include_router(auth_router)
app.include_router(user_router)
