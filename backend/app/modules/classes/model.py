import enum
from typing import TYPE_CHECKING

from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp
from app.core.database import Base

if TYPE_CHECKING:
    from app.modules.users.model import User
    from app.modules.matiere.model import Matiere
    from app.modules.documents.model import Document
    from app.modules.annonces.model import Annonce


class Niveau(str, enum.Enum):
    L1 = "L1"
    L2 = "L2"
    L3 = "L3"
    M1 = "M1"
    M2 = "M2"


class Mention(str, enum.Enum):
    DAII = "DAII"
    ICM = "ICM"
    AES = "AES"
    AUTRE = "AUTRE"


class Classe(UuidStamp, Base):
    __tablename__ = "classes"

    nom: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    niveau: Mapped[Niveau] = mapped_column(
        Enum(Niveau),
        nullable=False,
        index=True,
    )

    mention: Mapped[Mention] = mapped_column(
        Enum(Mention),
        nullable=False,
        index=True,
    )

    users: Mapped[list["User"]] = relationship(
        "User",
        back_populates="classe",
    )

    matieres: Mapped[list["Matiere"]] = relationship(
        "Matiere",
        back_populates="classe",
        cascade="all, delete-orphan",
    )

    documents: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="classe",
    )

    announcements: Mapped[list["Annonce"]] = relationship(
        "Annonce",
        back_populates="classe",
    )