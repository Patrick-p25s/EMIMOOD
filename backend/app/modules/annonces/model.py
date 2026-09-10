import enum
import uuid
from datetime import datetime
from sqlalchemy.orm import  relationship
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
from sqlalchemy.orm import Mapped, mapped_column, relationships

from app.core.base_model import UuidStamp
from app.core.database import  Base


class AnnonceStatut(str, enum.Enum):
    active = "active"
    archivee = "archivee"


class Annonce(UuidStamp, Base):
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

    classe: Mapped["Classe | None"] = relationship(
        "Classe",
        back_populates="annonces",
    )

    classe_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("classe.id", ondelete="SET NULL"), nullable=True, index=True
    )




class AnnonceLecture(UuidStamp, Base):
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
