from uuid import UUID
from app.core.normalised_id import normalized_id
from app.modules.documents.model import (
    Document,
    DocumentStatus,
    DocumentType,
    DocumentSauvegarde,
)
from sqlalchemy import func, or_, select
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
        result = await self.db.execute(
            select(Document).where(Document.id == normalized_id(document_id))
        )
        return result.scalar_one_or_none()

    async def update(self, document: Document, data: dict):
        for key, value in data.items():
            setattr(document, key, value)
        await self.db.commit()
        await self.db.refresh(document)
        return document

    async def list_by_owner(
        self, owner_id: UUID | str, offset: int, limit: int
    ) -> tuple[list[Document], int]:
        owner_uuid = normalized_id(owner_id)
        total_result = await self.db.execute(
            select(func.count())
            .select_from(Document)
            .where(Document.owner_id == owner_uuid)
        )
        result = await self.db.execute(
            select(Document)
            .where(Document.owner_id == owner_uuid)
            .order_by(Document.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all(), total_result.scalar_one()

    async def stat_document(self, user_id: UUID | str):
        base_query = (
            select(func.count())
            .select_from(Document)
            .where(Document.owner_id == normalized_id(user_id))
        )
        document = await self.db.execute(base_query)
        pending_query = base_query.where(
            Document.statut == DocumentStatus.en_attente.value
        )
        pending = await self.db.execute(pending_query)

        return {
            "document": document.scalar_one(),
            "pending": pending.scalar_one(),
        }

    async def list_pending(
        self,
        classe_id: UUID | str | None,
        matiere_id: UUID | str | None,
        offset: int,
        limit: int,
    ) -> tuple[list[Document], int]:
        query = select(Document).where(
            Document.statut == DocumentStatus.en_attente.value
        )
        if classe_id is not None:
            query = query.where(Document.classe_id == classe_id)

        if matiere_id is not None:
            query = query.where(Document.matiere_id == matiere_id)

        total_result = await self.db.execute(
            select(func.count()).select_from(query.subquery())
        )
        result = await self.db.execute(
            query.order_by(Document.created_at.desc()).offset(offset).limit(limit)
        )
        return result.scalars().all(), total_result.scalar_one()

    async def list_public(
        self,
        classe_id: UUID | str | None,
        matiere_id: UUID | str | None,
        document_type: DocumentType | None,
        offset: int,
        limit: int,
    ) -> tuple[list[Document], int]:
        query = select(Document).where(Document.statut == DocumentStatus.public)
        if classe_id is not None:
            query = query.where(
                or_(
                    Document.classe_id.is_(None),
                    Document.classe_id == normalized_id(classe_id),
                )
            )
        else:
            query = query.where(Document.classe_id.is_(None))

        if matiere_id is not None:
            query = query.where(Document.matiere_id == matiere_id)

        if document_type is not None:
            query = query.where(Document.type_document == document_type)

        total_result = await self.db.execute(
            select(func.count()).select_from(query.subquery())
        )
        result = await self.db.execute(
            query.order_by(Document.created_at.desc()).offset(offset).limit(limit)
        )
        return result.scalars().all(), total_result.scalar_one()

    async def get_all_rejected(
        self, classe_id: str | UUID | None = None, matiere_id: str | UUID | None = None
    ):
        query = select(Document).where(Document.statut == DocumentStatus.rejete.value)
        if classe_id is not None:
            query = query.where(Document.classe_id == classe_id)

        if matiere_id is not None:
            query = query.where(Document.matiere_id == matiere_id)

        result = await self.db.execute(query)
        return result.scalars().all()

    async def not_private_doc(
        self, classe_id: str | str | None = None, offset: int = 0, limit: int = 20
    ):
        query = select(Document).where(Document.statut != DocumentStatus.prive)
        if classe_id is not None:
            query = query.where(Document.classe_id == normalized_id(classe_id))
        total_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(total_query)
        total = total_result.scalar_one()
        result = await self.db.execute(
            query.order_by(Document.created_at.desc()).offset(offset).limit(limit)
        )
        documents = result.scalars().all()
        return documents, total

    async def delete(self, matiere: Document) -> None:
        await self.db.delete(matiere)
        await self.db.commit()

    async def get_all_my_docs(self, owner_id: str | UUID):
        result = await self.db.execute(
            select(Document).where(Document.owner_id == owner_id)
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
            select(DocumentSauvegarde).where(
                DocumentSauvegarde.user_id == normalized_id(owner_id)
            )
        )
        return result.scalars().all()

    async def stats_save(self, user_id: str | UUID):
        save = await self.db.execute(
            select(func.count())
            .select_from(DocumentSauvegarde)
            .where(DocumentSauvegarde.user_id == normalized_id(user_id))
        )
        return {"saved": save.scalar_one()}

    async def list_by_folder(self, folder_id: UUID | str):
        result = await self.db.execute(
            select(DocumentSauvegarde).where(
                DocumentSauvegarde.folder_id == normalized_id(folder_id)
            )
        )
        return result.scalars().all()

    async def get_by_id(self, id: UUID | str):
        result = await self.db.execute(
            select(DocumentSauvegarde).where(DocumentSauvegarde.id == normalized_id(id))
        )
        return result.scalar_one_or_none()

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
