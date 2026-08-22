import enum
import uuid

from app.core.base_model import UuidStamp
from app.core.database import Base
from sqlalchemy import Boolean, Enum, ForeignKey, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column


class AnnonceStatut(str, enum.Enum):
    active = "active"
    archivee = "archivee"


class Annonce(Base, UuidStamp):
    __tablename__ = "annonces"

    titre: Mapped[str] = mapped_column(String(150), nullable=False)
    contenu: Mapped[str] = mapped_column(Text, nullable=False)
    important: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    statut: Mapped[AnnonceStatut] = mapped_column(
        Enum(AnnonceStatut), default=AnnonceStatut.active, nullable=False
    )

    auteur_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=False
    )

    # nullable=True : NULL = annonce globale (visible par tous), sinon portée à une classe précise.
    # Pas de  ondelete="CASCADE" : on ne veut jamais perdre l'historique des annonces
    # en supprimant une classe — même logique que Document → Subject.
    classe_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("classe.id"), nullable=True, index=True
    )


class AnnonceLecture(Base, UuidStamp):
    __tablename__ = "annonce_lectures"

    annonce_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("annonces.id"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=False
    )
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    is_archive: Mapped[bool] = mapped_column(Boolean, default=False)
    __table_args__ = (
        UniqueConstraint("annonce_id", "user_id", name="uq_annonce_user_lecture"),
    )
