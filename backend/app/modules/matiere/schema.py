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
    desciption: str
    semester: str
    create_at: datetime
    update_at: datetime
    model_config = {"from_attributes": True}
