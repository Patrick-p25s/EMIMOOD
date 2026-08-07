from uuid import UUID

from app.modules.sauvegarde.repository import SauvegardeRepository
from fastapi import HTTPException, status


class SauvegardeService:
    def __init__(self, repo: SauvegardeRepository):
        self.repo = repo

    async def get_all_my_document(self, owner_id: UUID):
        return await self.repo.list_documents_for_user(owner_id)

    async def get_my_docs_by_id(self, owner_id: UUID, document_id: UUID):
        sauvegarde = await self.repo.get_by_user_and_document(owner_id, document_id)
        if sauvegarde is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                "Document non enregistré dans votre dashboard",
            )
        return sauvegarde

    async def delete_document(self, owner_id: UUID, document_id: UUID):
        sauvegarde = await self.repo.get_by_user_and_document(owner_id, document_id)
        if sauvegarde is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
        await self.repo.delete(sauvegarde)
        return True
