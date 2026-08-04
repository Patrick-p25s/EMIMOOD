from app.core.database import Base
from app.core.base_model import UuidStamp
from sqlalchemy import DateTime, Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime


class YearUniv(Base, UuidStamp):
    __tablename__ = "year_univ"
    label: Mapped[str] = mapped_column(String(50), nullable=False)
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
