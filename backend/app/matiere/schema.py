from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class SubjectCreate(BaseModel):
    name: str
    description: str
    coefficient: int
    semester: str
    classe_id: UUID | str


class SubjectOut(SubjectCreate):
    id: UUID
    create_at: datetime
    update_at: datetime
