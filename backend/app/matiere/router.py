from app.core.database import get_db
from app.core.dependencies import require_admin
from app.matiere.repository import SubjectRepository
from app.matiere.schema import SubjectCreate, SubjectOut
from app.matiere.service import SubjectService
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession


def get_Subject_service(db: AsyncSession = Depends(get_db)) -> SubjectService:
    return SubjectService(SubjectRepository(db=db))


router = APIRouter(
    prefix="/subjects",
    tags=["Subject router"],
    dependencies=[Depends(require_admin)],
)


@router.post("/create", response_model=SubjectOut)
async def create_Subject(
    request: SubjectCreate, service: SubjectService = Depends(get_Subject_service)
) -> SubjectOut:
    return await service.create_new_subject(request=request)


@router.get("/all", response_model=list[SubjectOut])
async def get_all_Subject(
    service: SubjectService = Depends(get_Subject_service),
) -> list[SubjectOut]:
    return await service.get_all_subject()


@router.put("/update/{id}", response_model=SubjectOut)
async def update_subject(
    id: str,
    request: SubjectCreate,
    service: SubjectService = Depends(get_Subject_service),
) -> SubjectOut:
    return await service.update_subject(id, request)


@router.get("/{id}", response_model=SubjectOut)
async def get_Subject(
    id: str, service: SubjectService = Depends(get_Subject_service)
) -> SubjectOut:
    return await service._get_subject_by_id(id)


@router.delete("/{id}")
async def delete_Subject(
    id: str, service: SubjectService = Depends(get_Subject_service)
) -> bool:
    return await service.delete_subject(id)
