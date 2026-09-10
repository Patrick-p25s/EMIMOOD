import enum
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Integer, String, Text, Uuid, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp
from app.core.database import Base

if TYPE_CHECKING:
    from app.modules.classes.model import Classe
    from app.modules.users.model import User
    from app.modules.matiere.model import Matiere
    from app.modules.folder.model import Folder


class DocumentType(str, enum.Enum):
    pdf = "pdf"
    video = "video"
    image = "image"
    autre = "autre"


class DocumentStatus(str, enum.Enum):
    private = "PRIVATE"
    pending = "PENDING"
    public = "PUBLIC"
    rejected = "REJECTED"


class Document(UuidStamp, Base):
    __tablename__ = "documents"

    nom: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    file_url: Mapped[str] = mapped_column(
        String(1000),
        nullable=False,
    )

    type: Mapped[DocumentType] = mapped_column(
        Enum(DocumentType),
        nullable=False,
        index=True,
    )

    taille: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    class_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("classes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    uploaded_by_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    matiere_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid,
        ForeignKey("matieres.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    folder_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid,
        ForeignKey("folders.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    status: Mapped[DocumentStatus] = mapped_column(
        Enum(DocumentStatus),
        default=DocumentStatus.private,
        nullable=False,
        index=True,
    )

    classe: Mapped["Classe"] = relationship(
        "Classe",
        back_populates="documents",
    )

    uploaded_by: Mapped["User"] = relationship(
        "User",
        back_populates="documents",
        foreign_keys=[uploaded_by_id],
    )

    matiere: Mapped["Matiere | None"] = relationship(
        "Matiere",
        back_populates="documents",
    )

    folder: Mapped["Folder | None"] = relationship(
        "Folder",
        back_populates="documents",
    )

    saved_documents: Mapped[list["DocumentSauvegarde"]] = relationship(
        "DocumentSauvegarde",
        back_populates="document",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index(
            "ix_documents_class_status",
            "class_id",
            "status",
        ),
    )


class DocumentSauvegarde(UuidStamp, Base):
    __tablename__ = "saved_documents"

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

    folder_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid,
        ForeignKey("folders.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    is_favorite: Mapped[bool] = mapped_column(
        nullable=False,
        default=False,
    )

    is_hidden: Mapped[bool] = mapped_column(
        nullable=False,
        default=False,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="saved_documents",
    )

    document: Mapped["Document"] = relationship(
        "Document",
        back_populates="saved_documents",
    )

    folder: Mapped["Folder | None"] = relationship(
        "Folder",
        back_populates="saved_documents",
    )