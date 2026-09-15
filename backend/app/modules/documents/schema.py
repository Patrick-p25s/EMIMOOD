from datetime import datetime
from uuid import UUID

from app.modules.documents.model import DocumentStatus, DocumentType
from pydantic import BaseModel


class DocumentCreate(BaseModel):
    titre: str
    description: str | None = None
    type_document: DocumentType
    date_limite: datetime | None = None
    proposer_publiquement: bool = False


class DocumentOut(BaseModel):
    id: UUID
    titre: str
    type_document: DocumentType
    statut: DocumentStatus
    description: str
    original_filename: str
    mime_type: str
    storage_key: str
    taille_octets: int
    owner_id: UUID
    matiere_id: UUID | None
    validated_by_id: UUID | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DocumentUpdate(BaseModel):
    titre: str | None = None
    description: str | None = None
    date_limite: datetime | None = None
    type_document: DocumentType | None = None
