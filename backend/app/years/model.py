from app.core.base_model import UuidStamp
from app.core.database import Base
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import String, DateTime, func
from datetime import datetime


class Years(Base, UuidStamp):
    __tablename__ = "anne_univ"
    label: Mapped[str] = mapped_column(String(25), nullable=False)
    start_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now()
    )
    end_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
