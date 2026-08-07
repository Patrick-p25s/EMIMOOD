import uuid

from app.core.base_model import UuidStamp
from app.core.database import Base
from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column


class Subject(Base, UuidStamp):
    __tablename__ = "subject"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    coefficient: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    semester: Mapped[str] = mapped_column(String(50), nullable=False)

    classe_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("classe.id", ondelete="CASCADE"), nullable=False, index=True
    )

    __table_args__ = (
        UniqueConstraint("classe_id", "name", name="uq_classe_subject_name"),
    )
