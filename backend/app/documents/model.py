import enum
from app.core.base_model import UuidStamp
from app.core.database import Base
from app.users.model import Users
from app.matiere.model import Subject
from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func


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
    type_document: Mapped["DocumentType"] = mapped_column(
        Enum(DocumentType), nullable=False
    )
    statut: Mapped["DocumentStatus"] = mapped_column(
        Enum(DocumentStatus), nullable=False, default=DocumentStatus.prive
    )

    fichier_path: Mapped[str] = mapped_column(String(150), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(50), nullable=False)
    taille_octets: Mapped[int] = mapped_column(Integer, nullable=False)

    owner_id: Mapped["Users"] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=False
    )
    matiere_id: Mapped["Subject"] = mapped_column(
        Uuid, ForeignKey("subject.id"), nullable=False
    )
    validated_by_id: Mapped["Users"] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=True
    )
