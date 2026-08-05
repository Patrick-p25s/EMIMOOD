from datetime import datetime
from uuid import UUID

from app.documents.model import DocumentStatus, DocumentType
from pydantic import BaseModel


class DocumentCreate(BaseModel):
    titre: str
    type_document: DocumentType
    date_limite: datetime
    proposer_publiquement: bool = False


class DocumentOut(BaseModel):
    id: UUID
    titre: str
    type_document: DocumentType
    statut: DocumentStatus
    fichier_path: str
    mime_type: str
    taille_octets: int
    owner_id: UUID
    matiere_id: UUID
    validated_by_id: UUID | None
    create_at: datetime
    update_at: datetime

    model_config = {"from_attributes": True}


class DocumentUpdate(BaseModel):
    titre: str | None = None
    description: str | None = None
    date_limite: datetime | None = None
    type_document: DocumentType | None = None
