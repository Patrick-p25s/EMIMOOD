import enum as PyEnum

from app.core.base_model import UuidStamp
from app.core.database import Base
from sqlalchemy import Enum, String, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.classes.model import Classe
from typing import Optional


class UserRole(str, PyEnum.Enum):
    student = "student"
    moderator = "moderator"
    admin = "admin"


class Users(Base, UuidStamp):
    __tablename__ = "users"
    first_name: Mapped[str] = mapped_column(String(150), nullable=True)
    last_name: Mapped[str] = mapped_column(String(200), nullable=True)
    avatar_url: Mapped[str] = mapped_column(String(200), nullable=True)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), default=UserRole.student, nullable=False
    )
    classe_id: Mapped["Classe"] = mapped_column(
        Uuid, ForeignKey("classe.id", ondelete="CASCADE"), nullable=True, index=True
    )

    classe: Mapped[Optional["Classe"]] = relationship(
        "Classe", back_populates="students"
    )
