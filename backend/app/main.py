from fastapi import FastAPI
from app.core.config import setting

app = FastAPI()

@app.get('/')
def index():
    return {"message" : setting.DATABASE_URL}