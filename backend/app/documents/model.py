import enum
import uuid
from datetime import datetime

from app.core.base_model import UuidStamp
from app.core.database import Base
from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column


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


class Document(Base, UuidStamp):
    __tablename__ = "documents"

    titre: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    date_limite: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    type_document: Mapped["DocumentType"] = mapped_column(
        Enum(DocumentType), nullable=False
    )
    statut: Mapped["DocumentStatus"] = mapped_column(
        Enum(DocumentStatus), nullable=False, default=DocumentStatus.prive
    )

    fichier_path: Mapped[str] = mapped_column(String(150), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(50), nullable=False)
    taille_octets: Mapped[int] = mapped_column(Integer, nullable=False)

    owner_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=False
    )
    matiere_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("subject.id"), nullable=False
    )
    validated_by_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=True
    )
