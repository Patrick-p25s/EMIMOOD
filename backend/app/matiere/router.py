from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, require_moderator
from app.matiere.repository import SubjectRepository
from app.matiere.schema import SubjectCreate, SubjectOut
from app.matiere.service import SubjectService
from app.users.model import Users
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession


def get_subject_service(db: AsyncSession = Depends(get_db)) -> SubjectService:
    return SubjectService(SubjectRepository(db=db))


router = APIRouter(prefix="/subjects", tags=["Gestion des Matières"])


@router.post(
    "/classe/{classe_id}",
    response_model=SubjectOut,
    status_code=status.HTTP_201_CREATED,
    summary="Créer une nouvelle matière",
    description="Ajoute une nouvelle matière rattachée à une classe spécifique (Réservé aux administrateurs).",
)
async def create_subject(
    classe_id: UUID,
    request: SubjectCreate,
    service: SubjectService = Depends(get_subject_service),
    user: Users = Depends(require_moderator),
) -> SubjectOut:
    return await service.create_new_subject(classe_id=classe_id, request=request)


@router.get(
    "",
    response_model=list[SubjectOut],
    summary="Lister toutes les matières",
    description="Récupère la liste complète des matières enregistrées dans le système.",
)
async def get_all_subjects(
    service: SubjectService = Depends(get_subject_service),
    user: Users = Depends(get_current_user),
) -> list[SubjectOut]:
    return await service.get_all_subject()


@router.get(
    "/classe/{classe_id}",
    response_model=list[SubjectOut],
    summary="Lister les matières par classe",
    description="Récupère l'ensemble des matières associées à une classe spécifique.",
)
async def get_subjects_by_classe(
    classe_id: UUID,
    service: SubjectService = Depends(get_subject_service),
    user: Users = Depends(get_current_user),
) -> list[SubjectOut]:
    return await service.get_by_class(classe_id)


@router.get(
    "/{subject_id}",
    response_model=SubjectOut,
    summary="Récupérer une matière par son ID",
    description="Renvoie les détails d'une matière spécifique à partir de son UUID.",
)
async def get_subject_by_id(
    subject_id: UUID,
    service: SubjectService = Depends(get_subject_service),
    user: Users = Depends(get_current_user),
) -> SubjectOut:
    return await service.get_subject_by_id(subject_id)


@router.put(
    "/{subject_id}",
    response_model=SubjectOut,
    summary="Mettre à jour une matière",
    description="Modifie les informations d'une matière existante (Réservé aux administrateurs).",
)
async def update_subject(
    subject_id: UUID,
    request: SubjectCreate,
    service: SubjectService = Depends(get_subject_service),
    user: Users = Depends(require_moderator),
) -> SubjectOut:
    return await service.update_subject(subject_id, request)


@router.delete(
    "/{subject_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Supprimer une matière",
    description="Supprime définitivement une matière du système via son UUID (Réservé aux administrateurs).",
)
async def delete_subject(
    subject_id: UUID,
    service: SubjectService = Depends(get_subject_service),
    user: Users = Depends(require_moderator),
) -> None:
    return await service.delete_subject(subject_id)
