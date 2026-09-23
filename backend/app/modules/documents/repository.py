from uuid import UUID
from app.core.normalised_id import normalized_id
from app.modules.documents.model import (
    Document,
    DocumentStatus,
    DocumentType,
    DocumentSauvegarde,
)
from sqlalchemy import func, or_, select, exists, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.matiere.model import Subject
from sqlalchemy.orm import joinedload


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
            select(Document)
            .options(joinedload(Document.owner))
            .where(Document.id == normalized_id(document_id))
        )
        return result.scalar_one_or_none()

    async def update(self, document: Document, data: dict):
        for key, value in data.items():
            setattr(document, key, value)
        await self.db.commit()
        await self.db.refresh(document)
        return document

    async def list_my_documents(
        self, user_id: UUID | str, offset: int, limit: int
    ) -> tuple[list[tuple[Document, UUID | None]], int]:
        user_uuid = normalized_id(user_id)

        saved_subquery = select(DocumentSauvegarde.document_id).where(
            DocumentSauvegarde.user_id == user_uuid
        )

        base_filter = or_(
            Document.owner_id == user_uuid,
            Document.id.in_(saved_subquery),
        )

        total_result = await self.db.execute(
            select(func.count()).select_from(Document).where(base_filter)
        )

        query = (
            select(Document, DocumentSauvegarde.folder_id)
            .options(joinedload(Document.owner))
            .outerjoin(
                DocumentSauvegarde,
                and_(
                    DocumentSauvegarde.document_id == Document.id,
                    DocumentSauvegarde.user_id == user_uuid,
                ),
            )
            .where(base_filter)
            .order_by(Document.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        result = await self.db.execute(query)
        rows = result.all()

        return rows, total_result.scalar_one()

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
        search: str | None,
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

        if search and len(search.strip()) >= 3:
            search_pattern = f"%{search.strip()}%"

            query = query.where(
                or_(
                    Document.titre.ilike(search_pattern),
                    Document.description.ilike(search_pattern),
                )
            )
        total_result = await self.db.execute(
            select(func.count()).select_from(query.subquery())
        )
        result = await self.db.execute(
            query.options(joinedload(Document.owner))
            .order_by(Document.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all(), total_result.scalar_one()

    async def list_public(
        self,
        classe_id: UUID | str | None,
        matiere_id: UUID | str | None,
        document_type: DocumentType | None,
        search: str | None,
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

        if search and len(search.strip()) >= 3:
            search_pattern = f"%{search.strip()}%"

            query = query.where(
                or_(
                    Document.titre.ilike(search_pattern),
                    Document.description.ilike(search_pattern),
                )
            )

        if matiere_id is not None:
            query = query.where(Document.matiere_id == matiere_id)

        if document_type is not None:
            query = query.where(Document.type_document == document_type)

        total_result = await self.db.execute(
            select(func.count()).select_from(query.subquery())
        )
        result = await self.db.execute(
            query.options(joinedload(Document.owner))
            .order_by(Document.created_at.desc())
            .offset(offset)
            .limit(limit)
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
        self,
        current_user_classe_id: UUID | str | None = None,
        offset: int = 0,
        limit: int = 20,
        search: str | None = None,
        document_type: DocumentType | None = None,
        statut: DocumentStatus | None = None,
        classe_id: UUID | str | None = None,
    ):
        query = select(Document).where(Document.statut != DocumentStatus.prive)
        if current_user_classe_id is not None:
            query = query.where(
                or_(
                    Document.classe_id == normalized_id(current_user_classe_id),
                    Document.classe_id == None,
                )
            )
        if document_type is not None:
            query = query.where(Document.type_document == document_type)

        if statut is not None:
            query = query.where(Document.statut == statut)

        if classe_id is not None:
            query = query.where(Document.classe_id == normalized_id(classe_id))
        if search and len(search.strip()) >= 3:
            search_pattern = f"%{search.strip()}%"

            query = query.where(
                or_(
                    Document.titre.ilike(search_pattern),
                    Document.description.ilike(search_pattern),
                )
            )
        total_query = select(func.count()).select_from(query.subquery())

        total_result = await self.db.execute(total_query)
        total = total_result.scalar_one()
        result = await self.db.execute(
            query.options(joinedload(Document.owner))
            .order_by(Document.created_at.desc())
            .offset(offset)
            .limit(limit)
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

    async def list_by_folder(self, folder_id: UUID | str) -> list[Document]:
        result = await self.db.execute(
            select(Document)
            .options(joinedload(Document.owner))
            .join(DocumentSauvegarde, DocumentSauvegarde.document_id == Document.id)
            .where(DocumentSauvegarde.folder_id == normalized_id(folder_id))
        )
        return list(result.scalars().all())

    async def already_saved(self, document_id: str | UUID, user_id: str | UUID) -> bool:
        result = await self.db.execute(
            select(
                exists()
                .where(DocumentSauvegarde.document_id == normalized_id(document_id))
                .where(DocumentSauvegarde.user_id == normalized_id(user_id))
            )
        )

        return result.scalar()

    async def get_by_document_id(self, document_id: UUID | str, user_id: str | UUID):
        result = await self.db.execute(
            select(DocumentSauvegarde)
            .where(DocumentSauvegarde.document_id == normalized_id(document_id))
            .where(DocumentSauvegarde.user_id == normalized_id(user_id))
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

    async def list_user_folder(self, user_id: str | UUID):
        result = await self.db.execute(
            select(DocumentSauvegarde).where(
                DocumentSauvegarde.user_id == normalized_id(user_id)
            )
        )
        return result.scalars().all()
