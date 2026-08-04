from app.classes.model import Mention, Niveau
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class ClasseCreate(BaseModel):
    mention: Mention
    niveau: Niveau


class ClasseOut(ClasseCreate):
    model_config = {"from_attributes": True}
    id: UUID
    year_id: UUID
    create_at: datetime
    update_at: datetime
