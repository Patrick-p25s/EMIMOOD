from uuid import UUID

from app.modules.documents.model import (
    Document,
    DocumentStatus,
    DocumentType,
    DocumentSauvegarde,
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.matiere.model import Subject


class DocumentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> Document:
        document = Document(**data)
        self.db.add(document)
        await self.db.commit()
        await self.db.refresh(document)
        return document

    async def get_by_id(self, document_id: UUID) -> Document | None:
        normalized = document_id if isinstance(document_id, UUID) else UUID(document_id)
        result = await self.db.execute(
            select(Document).where(Document.id == normalized)
        )
        return result.scalar_one_or_none()

    async def update(self, document: Document, data: dict):
        for key, value in data.items():
            setattr(document, key, value)
        await self.db.commit()
        await self.db.refresh(document)
        return document

    async def list_by_owner(self, owner_id: UUID | str):
        result = await self.db.execute(
            select(Document).where(Document.owner_id == owner_id)
        )
        return result.scalars().all()

    async def get_pending_by_classe(self, classe_id: UUID) -> list[Document]:
        """Documents en attente, restreints à une classe précise (usage modérateur)."""
        result = await self.db.execute(
            select(Document)
            .join(Subject, Subject.id == Document.matiere_id)
            .where(
                Document.statut == DocumentStatus.en_attente,
                Subject.classe_id == classe_id,
            )
        )
        return result.scalars().all()

    async def delete(self, matiere: Document) -> None:
        await self.db.delete(matiere)
        await self.db.commit()

    async def get_all_public(self):
        result = await self.db.execute(
            select(Document).where(Document.statut == DocumentStatus.public.value)
        )
        return result.scalars().all()

    async def list_public_by_matiere(self, matiere_id: UUID) -> list[Document]:
        result = await self.db.execute(
            select(Document)
            .where(Document.matiere_id == matiere_id)
            .where(Document.statut == DocumentStatus.public.value)
        )
        return result.scalars().all()

    async def get_all_my_docs(self, owner_id: str | UUID):
        result = await self.db.execute(
            select(Document).where(Document.owner_id == owner_id)
        )
        return result.scalars().all()

    async def get_by_type(self, type: DocumentType):
        result = await self.db.execute(
            select(Document).where(Document.type_document == type)
        )
        return result.scalars().all()

    async def get_pending(self):
        result = await self.db.execute(
            select(Document).where(Document.statut == DocumentStatus.en_attente.value)
        )
        return result.scalars().all()


class DocumentSaveRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> DocumentSauvegarde:
        new_saved = DocumentSauvegarde(**data)
        self.db.add(new_saved)
        await self.db.commit()
        await self.db.refresh(new_saved)
        return new_saved

    async def delete(self, data: DocumentSauvegarde):
        await self.db.delete(data)
        await self.db.commit()
        return True

    async def update(self, document: DocumentSauvegarde, data: dict):
        for key, value in data.items():
            setattr(document, key, value)
        await self.db.commit()
        await self.db.refresh(document)
        return document

    async def list_by_owner(self, owner_id: UUID | str):
        result = await self.db.execute(
            select(DocumentSauvegarde).where(DocumentSauvegarde.user_id == owner_id)
        )
        return result.scalars().all()

    async def list_by_matiere(self, folder_id: UUID | str):
        result = await self.db.execute(
            select(DocumentSauvegarde).where(DocumentSauvegarde.folder_id == folder_id)
        )
