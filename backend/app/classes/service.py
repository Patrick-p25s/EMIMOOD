from app.years.repository import YearRepository
from app.classes.repository import ClasseRepository
from app.classes.model import Classe
from app.classes.schema import ClasseOut, ClasseCreate
from fastapi import HTTPException, status
from uuid import UUID

import secrets


def _generate_invitation_code():
    return secrets.token_urlsafe(6).upper()


class ClasseService:
    def __init__(self, year_repo: YearRepository, class_repo: ClasseRepository):
        self.year_repo = year_repo
        self.class_repo = class_repo

    async def get_by_id(self, id: UUID | str):
        classe = await self.class_repo.get_by_id(id)
        if classe is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Classe not found"
            )

    async def create_classe(self, request: ClasseCreate) -> ClasseOut:
        year = await self.year_repo.get_activate_year()
        if year is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Aucune année est activée",
            )

        data = {
            "mention": request.mention,
            "niveau": request.niveau,
            "year_id": year.id,
            "code_invitation": await self._generate_invitation_code(),
        }
        return await self.class_repo.create(data)

    async def delete_classe(self, id: UUID | str) -> True:
        classe = await self.get_by_id(id)
        await self.class_repo.delete(classe)
        return True

    async def update_classe(self, id: UUID | str, request: ClasseCreate) -> ClasseOut:
        classe = await self.get_by_id(id)
        return await self.class_repo.delete(classe)

    async def get_all_classes(self):
        return await self.class_repo.list_all_classe()

    async def _generate_invitation_code(self):
        while True:
            code = _generate_invitation_code()
            if await self.class_repo.get_by_code_invitation(code) is None:
                return code

    async def regenerate_invitation_code(self, classe_id: UUID) -> Classe:
        classe = await self.classe_repo.get_by_id(classe_id)
        if classe is None:
            raise HTTPException(404, "Classe introuvable")

        classe.code_invitation = await self._generate_unique_code()
        return await self.classe_repo.update(
            classe, {"code_invitation": classe.code_invitation}
        )
