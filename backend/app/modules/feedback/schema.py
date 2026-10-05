from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime


class CreateFeedBack(BaseModel):
    titre: str
    description: str
    contact: str | None = None


class FeedBackRead(CreateFeedBack):
    id: UUID
    created_at: datetime
    updated_at: datetime
    is_read: bool = False
    model_config = ConfigDict(from_attributes=True)
