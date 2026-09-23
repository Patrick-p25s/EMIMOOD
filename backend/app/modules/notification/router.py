from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.core.pagination import Page, PaginationParams
from app.modules.users.model import Users

from app.modules.notification.service import NotificationService
from app.modules.notification.schema import NotificationRead
from app.modules.notification.repository import NotificationRepository
from app.core.database import get_db

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


def get_notification_service(db: AsyncSession = Depends(get_db)):
    return NotificationService(NotificationRepository(db))


@router.get(
    "", summary="Récupérer mes notifications", response_model=Page[NotificationRead]
)
async def get_my_notifications(
    params: PaginationParams = Depends(),
    current_user: Users = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
):
    return await service.get_my_notification(
        current_user,
        params,
    )


@router.get(
    "/unread-count",
    response_model=int,
    summary="Nombre de notifications non lues",
)
async def get_unread_count(
    current_user: Users = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
):
    return await service.get_unread_count(current_user)


@router.patch(
    "/{notification_id}/read",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Marquer une notification comme lue",
)
async def mark_notification_as_read(
    notification_id: UUID,
    current_user: Users = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
):
    await service.mark_as_read(
        notification_id,
        current_user,
    )


@router.patch(
    "/read-all",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Marquer toutes les notifications comme lues",
)
async def mark_all_notifications_as_read(
    current_user: Users = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
):
    await service.mark_all_as_read(current_user)


@router.delete(
    "/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Supprimer une notification",
)
async def delete_notification(
    notification_id: UUID,
    current_user: Users = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
):
    await service.delete_notification(str(notification_id))


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Supprimer toutes mes notifications",
)
async def delete_all_notifications(
    current_user: Users = Depends(get_current_user),
    service: NotificationService = Depends(get_notification_service),
):
    await service.delete_all(current_user)
