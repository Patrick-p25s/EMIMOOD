from uuid import UUID

from sqlalchemy import (
    and_,
    delete as sql_delete,
    func,
    or_,
    select,
    update,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.normalised_id import normalized_id
from app.modules.notification.model import Notification
from app.modules.notification.model import NotificationLecture
from app.modules.users.model import Users


class NotificationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> Notification:
        notification = Notification(**data)

        self.db.add(notification)

        await self.db.commit()
        await self.db.refresh(notification)

        return notification

    async def list_by_user(
        self,
        user: Users,
        offset: int,
        limit: int,
    ):
        read_subquery = (
            select(NotificationLecture.is_read)
            .where(
                and_(
                    NotificationLecture.notification_id == Notification.id,
                    NotificationLecture.user_id == user.id,
                )
            )
            .correlate(Notification)
            .scalar_subquery()
        )

        visibility_filter = or_(
            # Notification personnelle
            Notification.to_user_id == user.id,
            # Notification de classe ou globale
            and_(
                Notification.to_user_id.is_(None),
                or_(
                    Notification.classe_id == user.classe_id,
                    Notification.classe_id.is_(None),
                ),
            ),
        )

        # Notifications paginées
        result = await self.db.execute(
            select(
                Notification,
                func.coalesce(read_subquery, False).label("is_read"),
            )
            .where(visibility_filter)
            .order_by(Notification.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        items = result.all()

        # Nombre total
        count_result = await self.db.execute(
            select(func.count(Notification.id)).where(visibility_filter)
        )

        total = count_result.scalar_one()

        return items, total

    async def get_by_id(
        self,
        notification_id: UUID | str,
    ) -> Notification | None:
        result = await self.db.execute(
            select(Notification).where(
                Notification.id == normalized_id(notification_id)
            )
        )

        return result.scalar_one_or_none()

    async def mark_as_read(
        self,
        notification_id: UUID | str,
        user_id: UUID | str,
    ) -> NotificationLecture:
        notification_uuid = normalized_id(notification_id)
        user_uuid = normalized_id(user_id)

        result = await self.db.execute(
            select(NotificationLecture).where(
                and_(
                    NotificationLecture.notification_id == notification_uuid,
                    NotificationLecture.user_id == user_uuid,
                )
            )
        )

        lecture = result.scalar_one_or_none()

        if lecture is None:
            lecture = NotificationLecture(
                notification_id=notification_uuid,
                user_id=user_uuid,
                is_read=True,
            )

            self.db.add(lecture)

        else:
            lecture.is_read = True

        await self.db.commit()
        await self.db.refresh(lecture)

        return lecture

    async def mark_all_as_read(
        self,
        user_id: UUID | str,
    ) -> None:
        user_uuid = normalized_id(user_id)

        notification_ids = select(Notification.id).where(
            or_(
                Notification.to_user_id == user_uuid,
                and_(
                    Notification.to_user_id.is_(None),
                    Notification.classe_id.is_not(None),
                ),
            )
        )

        existing = await self.db.execute(
            select(NotificationLecture).where(
                and_(
                    NotificationLecture.user_id == user_uuid,
                    NotificationLecture.notification_id.in_(notification_ids),
                )
            )
        )

        lectures = existing.scalars().all()

        existing_ids = {lecture.notification_id for lecture in lectures}

        for lecture in lectures:
            lecture.is_read = True

        all_notifications = await self.db.execute(
            select(Notification.id).where(
                or_(
                    Notification.to_user_id == user_uuid,
                    Notification.classe_id.is_not(None),
                )
            )
        )

        for notification_id in all_notifications.scalars():
            if notification_id not in existing_ids:
                self.db.add(
                    NotificationLecture(
                        notification_id=notification_id,
                        user_id=user_uuid,
                        is_read=True,
                    )
                )

        await self.db.commit()

    async def count_unread(
        self,
        user: Users,
    ) -> int:
        read_subquery = (
            select(NotificationLecture.is_read)
            .where(
                and_(
                    NotificationLecture.notification_id == Notification.id,
                    NotificationLecture.user_id == user.id,
                )
            )
            .correlate(Notification)
            .scalar_subquery()
        )

        visibility_filter = or_(
            Notification.to_user_id == user.id,
            and_(
                Notification.to_user_id.is_(None),
                or_(
                    Notification.classe_id == user.classe_id,
                    Notification.classe_id.is_(None),
                ),
            ),
        )

        result = await self.db.execute(
            select(func.count(Notification.id)).where(
                and_(
                    visibility_filter,
                    func.coalesce(read_subquery, False).is_(False),
                )
            )
        )

        return result.scalar_one()

    async def delete(
        self,
        notification: Notification,
    ) -> None:
        await self.db.delete(notification)
        await self.db.commit()

    async def delete_all_by_user(
        self,
        user_id: UUID | str,
    ) -> None:
        user_uuid = normalized_id(user_id)

        await self.db.execute(
            sql_delete(Notification).where(Notification.to_user_id == user_uuid)
        )

        await self.db.commit()
