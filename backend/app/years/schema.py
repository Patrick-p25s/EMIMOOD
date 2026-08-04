from pydantic import BaseModel
from datetime import datetime
from app.core.database import Base
from app.core.base_model import UuidStamp
from uuid import UUID


class YearCreate(BaseModel):
    label: str
    start_at: datetime
    end_at: datetime


class YearOut(YearCreate):
    id: UUID | str
    create_at: datetime
    update_at: datetime
    is_active: bool
    model_config = {"from_attributes": True, "extra": "ignore"}
