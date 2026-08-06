from app.matiere.repository import SubjectRepository
from app.matiere.schema import SubjectOut, SubjectCreate
from app.matiere.model import Subject
from app.core.security import hash_password
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from uuid import UUID


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
        self, classe_id: str, request: SubjectCreate
    ) -> SubjectOut:
        if await self.repo.get_by_name(request.name) is not None:
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

    async def get_all_subject(self) -> list[SubjectOut]:
        return await self.repo.list_all_matiere()

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

    async def get_by_class(self, classe_id: str):
        return await self.repo.get_by_classe(classe_id)
