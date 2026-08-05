from uuid import UUID

from app.documents.model import Document
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


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

    async def list_by_matiere(self, matiere_id: UUID) -> list[Document]:
        result = await self.db.execute(
            select(Document).where(Document.matiere_id == matiere_id)
        )
        return result.scalars().all()
