import uuid

from app.core.base_model import UuidStamp
from app.core.database import Base
from sqlalchemy import ForeignKey, Uuid, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column


class DocumentSauvegarde(Base, UuidStamp):
    __tablename__ = "document_sauvegardes"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=False
    )
    document_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("documents.id"), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("user_id", "document_id", name="uq_user_document"),
    )
