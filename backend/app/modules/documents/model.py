import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Uuid,
    Boolean,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.modules.classes.model import Classe
    from app.modules.folder.model import Folder
    from app.modules.matiere.model import Subject
    from app.modules.users.model import Users

from app.core.base_model import UuidStamp


class DocumentType(str, enum.Enum):
    cours = "cours"
    td = "td"
    examen = "examen"
    corrige = "corrige"
    autre = "autre"


class DocumentStatus(str, enum.Enum):
    prive = "prive"
    en_attente = "en_attente"
    public = "public"
    rejete = "rejete"


class Document(UuidStamp):
    __tablename__ = "documents"

    titre: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    date_limite: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    type_document: Mapped[DocumentType] = mapped_column(
        Enum(DocumentType), nullable=False
    )
    statut: Mapped[DocumentStatus] = mapped_column(
        Enum(DocumentStatus), nullable=False, default=DocumentStatus.prive, index=True
    )
    motif_rejet: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Gestion propre du stockage
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    storage_key: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    taille_octets: Mapped[int] = mapped_column(Integer, nullable=False)

    # relation
    owner_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    matiere_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("subject.id", ondelete="SET NULL"), nullable=True, index=True
    )

    classe_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("classe.id"), nullable=True
    )

    validated_by_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    __table_args__ = (Index("ix_documents_matiere_statut", "matiere_id", "statut"),)

    owner: Mapped["Users"] = relationship(
        "Users", back_populates="owned_documents", foreign_keys=[owner_id]
    )
    validated_by: Mapped["Users | None"] = relationship(
        "Users",
        back_populates="validated_documents",
        foreign_keys=[validated_by_id],
    )
    matiere: Mapped["Subject | None"] = relationship(
        "Subject", back_populates="documents"
    )
    classe: Mapped["Classe | None"] = relationship("Classe", back_populates="documents")
    sauvegardes: Mapped[list["DocumentSauvegarde"]] = relationship(
        "DocumentSauvegarde", back_populates="document", passive_deletes=True
    )


class DocumentSauvegarde(UuidStamp):
    __tablename__ = "document_sauvegardes"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    document_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False
    )
    folder_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("folders.id"), nullable=True
    )

    is_favorite: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )
    is_hidden: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    folder: Mapped["Folder | None"] = relationship(
        "Folder", back_populates="documents_sauvegardes"
    )
    __table_args__ = (
        UniqueConstraint("user_id", "document_id", name="uq_user_document"),
    )

    user: Mapped["Users"] = relationship("Users", back_populates="document_sauvegardes")
    document: Mapped["Document"] = relationship(
        "Document", back_populates="sauvegardes"
    )
