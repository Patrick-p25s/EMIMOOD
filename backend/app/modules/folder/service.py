from app.modules.folder.repository import FolderRepository
from app.modules.folder.schema import FolderCreate, FolderUpdate
from app.modules.users.model import Users
from app.core.pagination import make_page, PaginationParams
from fastapi import HTTPException, status


class FolderService:
    def __init__(self, repo: FolderRepository):
        self.repo = repo

    async def create_document(self, current_user: Users, new_data: FolderCreate):
        data = {
            "name": new_data.name,
            "description": new_data.description,
            "user_id": current_user.id,
        }
        return await self.repo.create(data)

    async def get_all_folder(self, current_user: Users, params: PaginationParams):
        folder, total = await self.repo.list_all(
            current_user.id, params.offset, params.limit
        )
        return make_page(folder, total, params)

    async def get_folder_by_id(self, id: str, current_user: Users):
        folder = await self.repo.get_by_id(id)
        if folder is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Aucune dossier trouvé")
        if folder.user_id != current_user.id:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN, "Vous aves pas acces a cette dossier"
            )
        return folder

    async def update_folder(self, id: str, data: FolderUpdate, current_user: Users):
        folder = await self.get_folder_by_id(id, current_user)
        new_data = {"name ": data.name, "description": data.description}
        return await self.repo.update(folder, new_data)

    async def delete_folder(self, id: str, current_user: Users):
        folder = await self.get_folder_by_id(id, current_user)
        await self.repo.delete_folder(folder)
        return True
