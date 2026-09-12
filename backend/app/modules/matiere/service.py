from app.modules.matiere.repository import SubjectRepository
from app.modules.matiere.schema import SubjectOut, SubjectCreate
from app.modules.matiere.model import Subject
from app.core.pagination import Page, PaginationParams, make_page
from app.core.security import hash_password
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from uuid import UUID
from app.modules.users.model import Users


class SubjectService:
    def __init__(self, repo: SubjectRepository):
        self.repo = repo

    async def get_subject_by_id(self, id: UUID | str) -> SubjectOut:
        matiere = await self.repo.get_by_id(id)
        if matiere is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found"
            )
        return matiere

    async def create_new_subject(
        self, classe_id: str | UUID | None, request: SubjectCreate
    ) -> SubjectOut:
        if classe_id is None:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Aucune classe trouvé ")
        if await self.repo.get_by_name(request.name, classe_id) is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Subject already existed",
            )
        data = {
            "name": request.name,
            "description": request.description,
            "coefficient": request.coefficient,
            "classe_id": classe_id,
            "semester": request.semester,
        }
        try:
            return await self.repo.create(data)
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Classse spécifiée n'existe pas ",
            )

    async def get_all_subject(self, params: PaginationParams) -> Page[SubjectOut]:
        matieres, total = await self.repo.list_all_matiere(
            offset=params.offset, limit=params.limit
        )
        return make_page(
            [SubjectOut.model_validate(m) for m in matieres], total, params
        )

    async def update_subject(
        self, id: UUID | str, request: SubjectCreate
    ) -> SubjectOut:
        matiere = await self.get_subject_by_id(id)

        data = {
            "name": request.name,
            "description": request.description,
            "coefficient": request.coefficient,
            "semester": request.semester,
        }
        return await self.repo.update(matiere, data)

    async def delete_subject(self, subject_id: UUID | str) -> bool:
        matiere = await self.get_subject_by_id(subject_id)
        await self.repo.delete(matiere)
        return True

    async def get_by_class(
        self, classe_id: str | UUID | None, params: PaginationParams
    ) -> Page[SubjectOut]:
        if classe_id is None:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Aucune classe trouvé")
        matieres, total = await self.repo.get_by_classe(
            classe_id, offset=params.offset, limit=params.limit
        )
        return make_page(
            [SubjectOut.model_validate(m) for m in matieres], total, params
        )
