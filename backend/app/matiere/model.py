from app.core.base_model import UuidStamp
from app.core.database import Base
from app.classes.model import Classe
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Integer, Uuid, ForeignKey


class Subject(Base, UuidStamp):
    __tablename__ = "subject"
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    coefficient: Mapped[int] = mapped_column(Integer, default=3, nullable=True)
    semester: Mapped[str] = mapped_column(String(50), nullable=False)
    classe_id: Mapped["Classe"] = mapped_column(
        Uuid, ForeignKey("classe.id", ondelete="CASCADE"), nullable=False, index=True
    )
