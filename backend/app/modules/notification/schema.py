from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from app.modules.notification.model import NotificationType


class NotificationRead(BaseModel):
    id: UUID
    from_user_id: UUID | None = None
    message: str
    is_read: bool
    to_user_id: UUID | None = None
    classe_id: UUID | None = None
    type: NotificationType
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class NotificationCreate(BaseModel):
    from_user_id: UUID | None = None
    classe_id: UUID | None = None
    to_user_id: UUID | None = None
    message: str
    type: NotificationType


class UnreadCond(BaseModel):
    count: int = 0
