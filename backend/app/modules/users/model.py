import enum
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp
from app.core.database import Base

if TYPE_CHECKING:
    from app.modules.classes.model import Classe
    from app.modules.documents.model import Document
    from app.modules.folder.model import Folder
    from app.modules.annonces.model import Annonce, AnnonceLecture
    from app.modules.documents.model import DocumentSauvegarde


class UserRole(str, enum.Enum):
    student = "student"
    moderator = "moderator"
    admin = "admin"


class User(UuidStamp, Base):
    __tablename__ = "users"

    nom: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    prenom: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        default=UserRole.student,
        nullable=False,
        index=True,
    )

    class_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("classes.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    classe: Mapped["Classe"] = relationship(
        "Classe",
        back_populates="users",
    )

    documents: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="uploaded_by",
        foreign_keys="Document.uploaded_by_id",
    )

    folders: Mapped[list["Folder"]] = relationship(
        "Folder",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    saved_documents: Mapped[list["DocumentSauvegarde"]] = relationship(
        "DocumentSauvegarde",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    announcements: Mapped[list["Annonce"]] = relationship(
        "Annonce",
        back_populates="author",
        foreign_keys="Annonce.author_id",
    )

    announcement_reads: Mapped[list["AnnonceLecture"]] = relationship(
        "AnnonceLecture",
        back_populates="user",
        cascade="all, delete-orphan",
    )