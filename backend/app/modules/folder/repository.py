from app.modules.folder.model import Folder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from app.core.normalised_id import normalized_id


class FolderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict):
        newData = Folder(**data)
        self.db.add(newData)
        await self.db.commit()
        self.db.refresh(newData)
        return newData

    async def count_folder(self, user_id: str | UUID):
        res = await self.db.execute(
            select(func.count())
            .select_from(Folder)
            .where(Folder.user_id == normalized_id(user_id))
        )
        return res.scalar_one()

    async def list_all(self, user_id: str | UUID, offset: int = 1, limit: int = 20):
        res = await self.db.execute(
            select(Folder)
            .where(Folder.user_id == normalized_id(user_id))
            .order_by(Folder.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        total = await self.count_folder(user_id)
        return res.scalars(), total

    async def get_by_id(self, folder_id: str | UUID):
        res = await self.db.execute(
            select(Folder).where(Folder.id == normalized_id(folder_id))
        )
        return res.scalar_one_or_none()

    async def update(self, folder: Folder, data: dict):
        for key, value in data.items():
            setattr(folder, key, value)

        await self.db.commit()
        await self.db.refresh(data)
        return data

    async def delete_folder(self, folder: Folder):
        await self.db.delete(folder)
        await self.db.commit()
        return True
