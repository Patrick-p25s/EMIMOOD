from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class SubjectCreate(BaseModel):
    name: str
    description: str
    coefficient: int
    semester: str


class SubjectOut(BaseModel):
    id: UUID
    name: str
    description: str | None
    coefficient: int
    semester: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
