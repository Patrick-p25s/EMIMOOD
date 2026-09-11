import enum as PyEnum
import uuid
from typing import TYPE_CHECKING, Optional, List
from sqlalchemy import Enum, ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp

if TYPE_CHECKING:
    from app.modules.classes.model import Classe
    from app.modules.folder.model import Folder


class UserRole(str, PyEnum.Enum):
    student = "student"
    moderator = "moderator"
    admin = "admin"


class Users(UuidStamp):
    __tablename__ = "users"

    first_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    email: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    matricule: Mapped[str | None] = mapped_column(
        String(20), unique=True, index=True, nullable=True
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), default=UserRole.student, nullable=False, index=True
    )

    classe_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("classe.id", ondelete="SET NULL"), nullable=True, index=True
    )

    folder : Mapped[List['Folder']] = relationship('Folder', back_populates="users")

    classe: Mapped[Optional["Classe"]] = relationship(
        "Classe", back_populates="students"
    )
