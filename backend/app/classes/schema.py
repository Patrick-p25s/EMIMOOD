from datetime import datetime
from uuid import UUID

from app.classes.model import Mention, Niveau
from pydantic import BaseModel


class ClasseCreate(BaseModel):
    mention: Mention
    niveau: Niveau


class ClasseOut(ClasseCreate):
    model_config = {"from_attributes": True}
    id: UUID
    year_id: UUID
    code_invitation: str
    create_at: datetime
    update_at: datetime
