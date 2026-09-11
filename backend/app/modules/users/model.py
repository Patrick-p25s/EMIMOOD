import enum as PyEnum
import uuid
from typing import TYPE_CHECKING, Optional
from sqlalchemy import Enum, ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp
from app.modules.folder.model import Folder

if TYPE_CHECKING:
    from app.modules.annonce.model import Annonce, AnnonceLecture
    from app.modules.auth.model import RefreshSession
    from app.modules.classes.model import Classe, ClasseModerateur
    from app.modules.documents.model import Document, DocumentSauvegarde


class UserRole(str, PyEnum.Enum):
    student = "student"
    moderator = "moderator"
    admin = "admin"


class Users(UuidStamp):
    __tablename__ = "users"

    first_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    email: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    matricule: Mapped[str | None] = mapped_column(
        String(20), unique=True, index=True, nullable=True
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), default=UserRole.student, nullable=False, index=True
    )

    classe_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("classe.id", ondelete="SET NULL"), nullable=True, index=True
    )

    folder: Mapped[list["Folder"]] = relationship("Folder", back_populates="user")

    classe: Mapped[Optional["Classe"]] = relationship(
        "Classe", back_populates="students"
    )
    refresh_sessions: Mapped[list["RefreshSession"]] = relationship(
        "RefreshSession", back_populates="user", passive_deletes=True
    )
    owned_documents: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="owner",
        foreign_keys="Document.owner_id",
        passive_deletes=True,
    )
    validated_documents: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="validated_by",
        foreign_keys="Document.validated_by_id",
    )
    document_sauvegardes: Mapped[list["DocumentSauvegarde"]] = relationship(
        "DocumentSauvegarde", back_populates="user", passive_deletes=True
    )
    authored_annonces: Mapped[list["Annonce"]] = relationship(
        "Annonce",
        back_populates="auteur",
        foreign_keys="Annonce.auteur_id",
        passive_deletes=True,
    )
    annonce_lectures: Mapped[list["AnnonceLecture"]] = relationship(
        "AnnonceLecture", back_populates="user", passive_deletes=True
    )
    moderated_classes: Mapped[list["ClasseModerateur"]] = relationship(
        "ClasseModerateur", back_populates="user", passive_deletes=True
    )
