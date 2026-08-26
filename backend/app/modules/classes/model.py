import enum as PyEnum
import uuid
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Enum, ForeignKey, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp

if TYPE_CHECKING:
    from app.modules.users.model import Users
    from app.modules.years.model import YearUniv
    from app.modules.subjects.model import Subject


class Mention(str, PyEnum.Enum):
    DAII = "DAII"
    ICM = "ICM"
    AES = "AES"
    AUTRE = "AUTRE"


class Niveau(str, PyEnum.Enum):
    L1 = "L1"
    L2 = "L2"
    L3 = "L3"
    M1 = "M1"
    M2 = "M2"
    AUTRE = "AUTRE"


class Classe(UuidStamp):
    __tablename__ = "classe"

    mention: Mapped[Mention] = mapped_column(
        Enum(Mention), default=Mention.DAII, nullable=False
    )
    niveau: Mapped[Niveau] = mapped_column(
        Enum(Niveau), default=Niveau.L1, nullable=False
    )
    code_invitation: Mapped[str] = mapped_column(
        String(10), unique=True, index=True, nullable=False
    )

    year_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("year_univ.id", ondelete="CASCADE"), nullable=False, index=True
    )

    anne_univ: Mapped["YearUniv"] = relationship("YearUniv", back_populates="classes")
    students: Mapped[List["Users"]] = relationship("Users", back_populates="classe")
    subjects: Mapped[List["Subject"]] = relationship(
        "Subject", back_populates="classe", cascade="all, delete-orphan"
    )


class ClasseModerateur(UuidStamp):
    __tablename__ = "classe_moderateurs"

    classe_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("classe.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True
    )

    __table_args__ = (
        UniqueConstraint("classe_id", "user_id", name="uq_classe_user_moderateur"),
    )
