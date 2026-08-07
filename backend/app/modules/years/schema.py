from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


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
