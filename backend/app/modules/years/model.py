from datetime import datetime
from typing import TYPE_CHECKING, List
from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp

if TYPE_CHECKING:
    from app.modules.classes.model import Classe


class YearUniv(UuidStamp):
    __tablename__ = "year_univ"

    label: Mapped[str] = mapped_column(String(50), nullable=False)
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, index=True
    )

    classes: Mapped[List["Classe"]] = relationship("Classe", back_populates="anne_univ")
