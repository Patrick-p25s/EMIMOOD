from datetime import datetime
from uuid import UUID

from app.modules.documents.model import DocumentStatus, DocumentType
from pydantic import BaseModel


class OwnerResponse(BaseModel):
    first_name: str
    last_name: str | None
    avatar_url: str | None = None


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
    description: str | None = None
    original_filename: str
    mime_type: str
    storage_key: str
    taille_octets: int
    owner_id: UUID
    matiere_id: UUID | None
    validated_by_id: UUID | None
    owner: OwnerResponse
    download_count: int | None
    save_count: int | None
    vue_count: int | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DocumentFolderOut(DocumentOut):
    folder_id: UUID | None | str


class DocumentUpdate(BaseModel):
    titre: str | None = None
    description: str | None = None
    date_limite: datetime | None = None
    type_document: DocumentType | None = None


class MoveDocumentSchema(BaseModel):
    folder_id: str | None = None
