from uuid import UUID

from fastapi import HTTPException, status

from app.core.pagination import PaginationParams
from app.modules.documents.model import Document
from app.modules.notification.model import NotificationType
from app.modules.notification.repository import NotificationRepository
from app.modules.notification.schema import (
    NotificationCreate,
    NotificationRead,
)
from app.modules.notification.ssemanager.service import notification_store
from app.modules.users.model import Users


class NotificationService:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    async def create_notif(
        self,
        data: NotificationCreate,
    ):
        new_data = {
            "to_user_id": data.to_user_id,
            "from_user_id": data.from_user_id,
            "classe_id": data.classe_id,
            "message": data.message,
            "type": data.type,
        }

        notif = await self.repo.create(new_data)

        read = NotificationRead.model_validate(notif)

        await self._push_live(notif, read)

        return read

    async def _push_live(
        self,
        notif,
        read: NotificationRead,
    ):
        payload = read.model_dump(mode="json")

        # Notification destinée à un seul utilisateur
        if notif.to_user_id is not None:
            queues = notification_store.get(notif.to_user_id)

            for queue in queues:
                queue.put_nowait(payload)

        # Notification destinée à toute une classe
        elif notif.classe_id is not None:
            queues = notification_store.get_by_class(notif.classe_id)

            for queue in queues:
                queue.put_nowait(payload)

    async def notify_new_annonce(
        self,
        user: Users,
    ):
        return await self.create_notif(
            NotificationCreate(
                type=NotificationType.new_annonce,
                from_user_id=user.id,
                classe_id=user.classe_id,
                message="Une nouvelle annonce est disponible.",
            )
        )

    async def notify_new_document(
        self,
        user: Users,
    ):
        return await self.create_notif(
            NotificationCreate(
                message="Un nouveau document est disponible.",
                classe_id=user.classe_id,
                type=NotificationType.new_public_doc,
                from_user_id=user.id,
            )
        )

    async def notify_reject_doc(
        self,
        document: Document,
        user: Users,
    ):
        return await self.create_notif(
            NotificationCreate(
                type=NotificationType.new_reject_doc,
                message="Votre document a été rejeté.",
                to_user_id=document.owner_id,
                from_user_id=user.id,
            )
        )

    async def notify_valide_doc(
        self,
        document: Document,
        user: Users,
    ):
        return await self.create_notif(
            NotificationCreate(
                type=NotificationType.new_valide_doc,
                message="Votre document a été validé.",
                to_user_id=document.owner_id,
                from_user_id=user.id,
            )
        )

    async def get_my_notification(
        self,
        user: Users,
        params: PaginationParams,
    ):
        rows = await self.repo.list_by_user(
            user,
            params.offset,
            params.limit,
        )

        return [
            NotificationRead.model_validate(
                {
                    **notification.__dict__,
                    "is_read": is_read,
                }
            )
            for notification, is_read in rows
        ]

    async def get_unread_count(
        self,
        user: Users,
    ):
        return await self.repo.count_unread(user)

    async def mark_as_read(
        self,
        notification_id: UUID | str,
        user: Users,
    ):
        notification = await self.repo.get_by_id(notification_id)

        if notification is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Aucune notification trouvée.",
            )

        return await self.repo.mark_as_read(
            notification.id,
            user.id,
        )

    async def mark_all_as_read(
        self,
        user: Users,
    ):
        return await self.repo.mark_all_as_read(user.id)

    async def delete_notification(
        self,
        notification_id: str,
    ):
        notification = await self.repo.get_by_id(notification_id)

        if notification is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Aucune notification trouvée.",
            )

        return await self.repo.delete(notification)

    async def delete_all(
        self,
        user: Users,
    ):
        return await self.repo.delete_all_by_user(user.id)
