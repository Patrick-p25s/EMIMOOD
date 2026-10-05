from app.core.base_model import UuidStamp
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean


class Feedback(UuidStamp):
    __tablename__ = "feedback"

    titre: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    contact: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
