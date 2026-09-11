import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp

if TYPE_CHECKING:
    from app.modules.classes.model import Classe
    from app.modules.users.model import Users


class AnnonceStatut(str, enum.Enum):
    active = "active"
    archivee = "archivee"


class Annonce(UuidStamp):
    __tablename__ = "annonces"

    titre: Mapped[str] = mapped_column(String(150), nullable=False)
    contenu: Mapped[str] = mapped_column(Text, nullable=False)
    important: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    statut: Mapped[AnnonceStatut] = mapped_column(
        Enum(AnnonceStatut), default=AnnonceStatut.active, nullable=False, index=True
    )
    date_archivage: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    auteur_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    classe_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("classe.id", ondelete="SET NULL"), nullable=True, index=True
    )

    auteur: Mapped["Users"] = relationship(
        "Users", back_populates="authored_annonces", foreign_keys=[auteur_id]
    )
    classe: Mapped["Classe | None"] = relationship(
        "Classe", back_populates="annonces"
    )
    lectures: Mapped[list["AnnonceLecture"]] = relationship(
        "AnnonceLecture", back_populates="annonce", passive_deletes=True
    )


class AnnonceLecture(UuidStamp):
    __tablename__ = "annonce_lectures"

    annonce_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("annonces.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    __table_args__ = (
        UniqueConstraint("annonce_id", "user_id", name="uq_annonce_user_lecture"),
    )

    annonce: Mapped["Annonce"] = relationship("Annonce", back_populates="lectures")
    user: Mapped["Users"] = relationship(
        "Users", back_populates="annonce_lectures"
    )
