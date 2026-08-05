import enum as PyEnum

from app.core.base_model import UuidStamp
from app.core.database import Base

from app.years.model import YearUniv
from sqlalchemy import Enum, ForeignKey, Uuid, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

# from app.users.model import Users
from typing import List


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


class Classe(Base, UuidStamp):
    __tablename__ = "classe"
    mention: Mapped[Mention] = mapped_column(
        Enum(Mention), default=Mention.DAII.value, nullable=False
    )
    niveau: Mapped[Niveau] = mapped_column(
        Enum(Niveau), default=Niveau.L1.value, nullable=False
    )
    code_invitation: Mapped[str] = mapped_column(
        String(10), unique=True, index=True, nullable=False
    )
    year_id: Mapped["YearUniv"] = mapped_column(
        Uuid, ForeignKey("year_univ.id", ondelete="CASCADE"), nullable=False, index=True
    )

    anne_univ: Mapped["YearUniv"] = relationship("YearUniv", back_populates="classes")

    students: Mapped[List["Users"]] = relationship("Users", back_populates="classe")
