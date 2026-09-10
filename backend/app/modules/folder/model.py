import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, UniqueConstraint, Uuid, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp
from app.core.database import Base

if TYPE_CHECKING:
    from app.modules.documents.model import DocumentSauvegarde
    from app.modules.users.model import User


class Folder(UuidStamp, Base):
    __tablename__ = "folders"
    nom: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    description = Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # Permet de créer des sous-dossiers
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid,
        ForeignKey("folders.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    # Relations
    user: Mapped["User"] = relationship(
        "User",
        back_populates="folders",
    )
    parent: Mapped["Folder | None"] = relationship(
        "Folder",
        back_populates="children",
        remote_side="Folder.id",
    )
    children: Mapped[list["Folder"]] = relationship(
        "Folder",
        back_populates="parent",
        cascade="all, delete-orphan",
    )
    documents_sauvegardes: Mapped[list["DocumentSauvegarde"]] = relationship(
        "DocumentSauvegarde",
        back_populates="folder",
        cascade="all, delete-orphan",
    )
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "parent_id",
            "nom",
            name="uq_user_folder_name",
        ),
    )