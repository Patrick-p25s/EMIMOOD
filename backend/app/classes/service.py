from app.years.repository import YearRepository
from app.classes.repository import ClasseRepository
from app.classes.model import Classe
from app.classes.schema import ClasseOut, ClasseCreate
from fastapi import HTTPException, status
from uuid import UUID
import secrets


def _generate_invitation_code():
    # Passage à 8 caractères pour réduire drastiquement les risques de collisions futures
    return secrets.token_urlsafe(8).upper()[:8]


class ClasseService:
    def __init__(self, year_repo: YearRepository, class_repo: ClasseRepository):
        self.year_repo = year_repo
        self.class_repo = class_repo

    async def get_by_id(self, id: UUID | str) -> Classe:
        classe = await self.class_repo.get_by_id(id)
        if classe is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Classe not found"
            )
        return classe

    async def create_classe(self, request: ClasseCreate) -> ClasseOut:
        year = await self.year_repo.get_activate_year()
        if year is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Aucune année n'est activée",
            )

        data = {
            "mention": request.mention,
            "niveau": request.niveau,
            "year_id": year.id,
            "code_invitation": await self._generate_invitation_code(),
        }
        return await self.class_repo.create(data)

    async def delete_classe(self, id: UUID | str) -> bool:
        classe = await self.get_by_id(id)  # Reçoit le vrai objet maintenant
        await self.class_repo.delete(classe)
        return True

    async def update_classe(self, id: UUID | str, request: ClasseCreate) -> ClasseOut:
        classe = await self.get_by_id(id)

        update_data = {"mention": request.mention, "niveau": request.niveau}
        return await self.class_repo.update(classe, update_data)

    async def get_all_classes(self):
        return await self.class_repo.list_all_classe()

    async def _generate_invitation_code(self):
        for _ in range(10):
            code = _generate_invitation_code()
            if await self.class_repo.get_by_code_invitation(code) is None:
                return code
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Impossible de générer un code d'invitation unique. Réessayez.",
        )

    async def regenerate_invitation_code(self, classe_id: UUID) -> Classe:
        classe = await self.class_repo.get_by_id(classe_id)
        if classe is None:
            raise HTTPException(404, "Classe introuvable")

        new_code = await self._generate_invitation_code()
        return await self.class_repo.update(classe, {"code_invitation": new_code})
