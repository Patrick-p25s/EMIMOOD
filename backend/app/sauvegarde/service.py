from app.sauvegarde.repository import SauvegardeRepository
from uuid import UUID
from fastapi import HTTPException, status


class SauvegardeService:
    def __init__(self, repo: SauvegardeRepository):
        self.repo = repo

    async def get_all_my_document(self, owner_id: UUID):
        return await self.repo.list_documents_for_user(owner_id)

    async def delete_document(self, owner_id: UUID, document_id: str | UUID):
        sauvegarde = await self.repo.get_by_id(owner_id, document_id)
        if sauvegarde is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
            )
        await self.repo.delete(sauvegarde)
        return True
