import uuid
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import func, Uuid, DateTime
from datetime import datetime


class UuidStamp:
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=lambda: uuid.uuid4()
    )
    create_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now()
    )
    update_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now()
    )
