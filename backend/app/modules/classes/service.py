from app.modules.years.repository import YearRepository
from app.modules.classes.repository import ClasseRepository
from app.modules.classes.model import Classe
from app.modules.classes.schema import ClasseOut, ClasseCreate
from fastapi import HTTPException, status
from app.core.pagination import PaginationParams, make_page, Page
from uuid import UUID
import secrets


def _generate_invitation_code():
    # Passage à 8 caractères pour réduire drastiquement les risques de collisions futures
    return secrets.token_urlsafe(8).upper()[:8]


class ClasseService:
    def __init__(self, year_repo: YearRepository, classe_repo: ClasseRepository):
        self.year_repo = year_repo
        self.classe_repo = classe_repo

    async def get_by_id(self, id: UUID | str) -> Classe:
        classe = await self.classe_repo.get_by_id(id)
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
        return await self.classe_repo.create(data)

    async def delete_classe(self, classe_id: UUID | str) -> bool:
        if await self.classe_repo.has_documents(classe_id):
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "Impossible de supprimer : des documents existent encore dans cette classe",
            )

        classe = await self.get_by_id(classe_id)
        await self.classe_repo.delete(classe)
        return True

    async def update_classe(self, id: UUID | str, request: ClasseCreate) -> ClasseOut:
        classe = await self.get_by_id(id)

        update_data = {"mention": request.mention, "niveau": request.niveau}
        return await self.classe_repo.update(classe, update_data)

    async def get_all_classes(self, params: PaginationParams) -> Page[ClasseOut]:
        classes, total = await self.classe_repo.list_all_classe(
            params.offset, params.limit
        )
        return make_page(classes, total, params)

    async def _generate_invitation_code(self):
        for _ in range(10):
            code = _generate_invitation_code()
            if await self.classe_repo.get_by_code_invitation(code) is None:
                return code
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Impossible de générer un code d'invitation unique. Réessayez.",
        )

    async def regenerate_invitation_code(self, classe_id: UUID) -> Classe:
        classe = await self.classe_repo.get_by_id(classe_id)
        if classe is None:
            raise HTTPException(404, "Classe introuvable")

        new_code = await self._generate_invitation_code()
        return await self.classe_repo.update(classe, {"code_invitation": new_code})

    async def get_all_student(self, classe_id: UUID, params: PaginationParams):
        await self.get_by_id(classe_id)
        students, total = await self.classe_repo.get_all_student(
            classe_id, params.offset, params.limit
        )
        return make_page(students, total, params)
