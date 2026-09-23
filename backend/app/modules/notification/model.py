from app.core.base_model import UuidStamp
from sqlalchemy import Uuid, Boolean, String, Enum, ForeignKey, UniqueConstraint
from enum import Enum as pyEnum
from sqlalchemy.orm import Mapped, mapped_column
from uuid import UUID


class NotificationType(str, pyEnum):
    new_annonce = "new_annonce"
    new_public_doc = "new_public_doc"
    new_reject_doc = "new_reject_doc"
    new_valide_doc = "new_valide_doc"


class Notification(UuidStamp):
    __tablename__ = "notifications"

    to_user_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
        nullable=True,
    )

    from_user_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    classe_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("classe.id", ondelete="SET NULL"),
        nullable=True,
    )

    message: Mapped[str] = mapped_column(String(255), nullable=False)

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    type: Mapped[NotificationType] = mapped_column(
        Enum(NotificationType),
        nullable=False,
    )


class NotificationLecture(UuidStamp):
    __tablename__ = "notification_lectures"

    notification_id: Mapped[UUID] = mapped_column(
        ForeignKey("notifications.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "notification_id",
            "user_id",
            name="uq_notification_lecture_user",
        ),
    )
