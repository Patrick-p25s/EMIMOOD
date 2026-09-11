import uuid
from typing import TYPE_CHECKING
from sqlalchemy import (
    ForeignKey,
    String,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.base_model import UuidStamp

if TYPE_CHECKING:
    from app.modules.documents.model import DocumentSauvegarde
    from app.modules.users.model import Users


class Folder(UuidStamp):
    __tablename__ = "folders"
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    desciption: Mapped[str] = mapped_column(String(200), nullable=True, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=False, index=True
    )
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("folders.id"), nullable=True, index=True
    )

    user: Mapped["Users"] = relationship("Users", back_populates="folder")
    parent: Mapped["Folder | None"] = relationship(
        "Folder", back_populates="children", remote_side="Folder.id"
    )
    children: Mapped[list["Folder"]] = relationship("Folder", back_populates="parent")
    documents_sauvegardes: Mapped[list["DocumentSauvegarde"]] = relationship(
        "DocumentSauvegarde", back_populates="folder"
    )
