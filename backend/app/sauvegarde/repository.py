from uuid import UUID

from app.documents.model import Document
from app.sauvegarde.model import DocumentSauvegarde
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload


class SauvegardeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> DocumentSauvegarde:
        sauvegarde = DocumentSauvegarde(**data)
        self.db.add(sauvegarde)
        await self.db.commit()
        await self.db.refresh(sauvegarde)
        return sauvegarde

    async def get_by_id(self, owner_id: UUID, document_id: UUID):
        result = await self.db.execute(
            select(DocumentSauvegarde.id).where(
                DocumentSauvegarde.user_id == owner_id,
                DocumentSauvegarde.document_id == document_id,
            )
        )
        return result.scalar_one_or_none()

    async def exists(self, user_id: UUID, document_id: UUID) -> bool:
        return await self.get_by_id(user_id, document_id) is not None

    async def get_by_user_and_document(
        self, user_id: UUID, document_id: UUID
    ) -> DocumentSauvegarde | None:
        result = await self.db.execute(
            select(DocumentSauvegarde).where(
                DocumentSauvegarde.user_id == user_id,
                DocumentSauvegarde.document_id == document_id,
            )
        )
        return result.scalar_one_or_none()

    async def delete(self, sauvegarde: DocumentSauvegarde) -> None:
        await self.db.delete(sauvegarde)
        await self.db.commit()

    async def list_documents_for_user(self, user_id: UUID) -> list[Document]:
        result = await self.db.execute(
            select(Document)
            .join(DocumentSauvegarde, DocumentSauvegarde.document_id == Document.id)
            .where(DocumentSauvegarde.user_id == user_id)
        )
        return result.scalars().all()
