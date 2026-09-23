from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class FolderCreate(BaseModel):
    name: str
    description: str | None


class FolderUpdate(BaseModel):
    name: str
    description: str | None


class FolderOut(BaseModel):
    id: UUID
    name: str
    description: str
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
