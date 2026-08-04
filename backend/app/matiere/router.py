from app.core.database import get_db
from app.core.dependencies import require_admin, get_current_user
from app.matiere.repository import SubjectRepository
from app.matiere.schema import SubjectCreate, SubjectOut
from app.matiere.service import SubjectService
from app.users.model import Users
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession


def get_Subject_service(db: AsyncSession = Depends(get_db)) -> SubjectService:
    return SubjectService(SubjectRepository(db=db))


router = APIRouter(
    prefix="/subjects",
    tags=["Subject router"],
)


@router.post("/create/{classe_id}", response_model=SubjectOut)
async def create_ubject(
    classe_id: str,
    request: SubjectCreate,
    service: SubjectService = Depends(get_Subject_service),
    user: Users = Depends(require_admin),
) -> SubjectOut:
    return await service.create_new_subject(classe_id=classe_id, request=request)


@router.get("/all", response_model=list[SubjectOut])
async def get_all_Subject(
    service: SubjectService = Depends(get_Subject_service),
    user: Users = Depends(get_current_user),
) -> list[SubjectOut]:
    return await service.get_all_subject()


@router.put("/update/{id}", response_model=SubjectOut)
async def update_subject(
    id: str,
    request: SubjectCreate,
    service: SubjectService = Depends(get_Subject_service),
    user: Users = Depends(require_admin),
) -> SubjectOut:
    return await service.update_subject(id, request)


@router.get("/{id}", response_model=SubjectOut)
async def get_subject(
    id: str,
    service: SubjectService = Depends(get_Subject_service),
    user: Users = Depends(get_current_user),
) -> SubjectOut:
    return await service.get_subject_by_id(id)


@router.delete("/{id}")
async def delete_subject(
    id: str,
    service: SubjectService = Depends(get_Subject_service),
    user: Users = Depends(require_admin),
) -> bool:
    return await service.delete_subject(id)


@router.get("/{classe_id}/classe", response_model=list[SubjectOut])
async def get_Subject_by_classe(
    classe_id: str, service: SubjectService = Depends(get_Subject_service)
) -> list[SubjectOut]:
    return await service.get_by_class(classe_id)
