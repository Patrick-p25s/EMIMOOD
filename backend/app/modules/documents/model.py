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
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp

if TYPE_CHECKING:
    from app.modules.matiere.model import Subject
    from app.modules.users.model import User


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

    titre: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    date_limite: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    type_document: Mapped[DocumentType] = mapped_column(
        Enum(DocumentType),
        nullable=False,
    )

    statut: Mapped[DocumentStatus] = mapped_column(
        Enum(DocumentStatus),
        nullable=False,
        default=DocumentStatus.prive,
        index=True,
    )

    motif_rejet: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    storage_key: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    mime_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    taille_octets: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    owner_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Nullable : un document peut être général
    matiere_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid,
        ForeignKey("subject.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    validated_by_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Relations
    uploaded_by: Mapped["User"] = relationship(
        "User",
        back_populates="documents_uploades",
        foreign_keys=[owner_id],
    )

    matiere: Mapped["Subject | None"] = relationship(
        "Subject",
        back_populates="documents",
    )

    validated_by: Mapped["User | None"] = relationship(
        "User",
        back_populates="documents_valides",
        foreign_keys=[validated_by_id],
    )

    documents_sauvegardes: Mapped[list["DocumentSauvegarde"]] = relationship(
        "DocumentSauvegarde",
        back_populates="document",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index(
            "ix_documents_matiere_statut",
            "matiere_id",
            "statut",
        ),
    )


class DocumentSauvegarde(UuidStamp):
    __tablename__ = "document_sauvegardes"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    document_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Relations
    user: Mapped["User"] = relationship(
        "User",
        back_populates="documents_sauvegardes",
    )

    document: Mapped["Document"] = relationship(
        "Document",
        back_populates="documents_sauvegardes",
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "document_id",
            name="uq_user_document",
        ),
    )