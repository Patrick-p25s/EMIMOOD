from datetime import datetime
from typing import List

from app.core.base_model import UuidStamp
from app.core.database import Base
from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class YearUniv(Base, UuidStamp):
    __tablename__ = "year_univ"

    label: Mapped[str] = mapped_column(String(50), nullable=False)
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)

    classes: Mapped[List["Classe"]] = relationship("Classe", back_populates="anne_univ")
