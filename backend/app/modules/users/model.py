import enum
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum as SAEnum
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp

if TYPE_CHECKING:
    from app.modules.annonces.model import Annonce, AnnonceLecture
    from app.modules.classes.model import Classe, ClasseModerateur
    from app.modules.documents.model import Document, DocumentSauvegarde
    from app.modules.folders.model import Folder


class UserRole(str, enum.Enum):
    student = "student"
    moderator = "moderator"
    admin = "admin"


class User(UuidStamp):
    __tablename__ = "users"

    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    prenom: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SAEnum(UserRole),
        nullable=False,
        index=True,
    )
    # Nullable : un admin peut ne pas appartenir à une classe
    classe_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("classe.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    # Relations
    classe: Mapped["Classe | None"] = relationship(
        "Classe",
        back_populates="students",
    )
    documents_uploades: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="uploaded_by",
        foreign_keys="Document.owner_id",
    )
    documents_sauvegardes: Mapped[list["DocumentSauvegarde"]] = relationship(
        "DocumentSauvegarde",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    folders: Mapped[list["Folder"]] = relationship(
        "Folder",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    annonces_ecrites: Mapped[list["Annonce"]] = relationship(
        "Annonce",
        back_populates="auteur",
        foreign_keys="Annonce.auteur_id",
    )
    annonce_lectures: Mapped[list["AnnonceLecture"]] = relationship(
        "AnnonceLecture",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    moderations: Mapped[list["ClasseModerateur"]] = relationship(
        "ClasseModerateur",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    documents_valides: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="validated_by",
        foreign_keys="Document.validated_by_id",
    )