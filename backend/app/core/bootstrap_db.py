import logging

from app.core.config import setting
from app.core.security import hash_password
from app.modules.users.model import UserRole, User
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)
_FALLBACK_ADMIN_EMAIL = "patrick@emimood.app"
_FALLBACK_ADMIN_PASSWORD = "patrick"


async def ensure_admin_user1(session: AsyncSession) -> None:
    """Create the bootstrap admin user if missing.

    Uses ADMIN_EMAIL / ADMIN_PASSWORD when provided, otherwise falls back to
    the built-in credentials above so an administrator always exists.
    Idempotent: does nothing if a user with the same email already exists.
    """
    email = (setting.ADMIN_EMAIL or "").strip().lower()
    password = (setting.ADMIN_PASSWORD or "").strip()

    if not email or not password:
        email = email or _FALLBACK_ADMIN_EMAIL
        password = password or _FALLBACK_ADMIN_PASSWORD
        logger.warning(
            "ADMIN_EMAIL ou ADMIN_PASSWORD absent : utilisation des "
            "identifiants de repli (%s). A remplacer par des identifiants "
            "dedies en production.",
            email,
        )

    existing = await session.execute(select(User).where(User.email == email))
    if existing.scalar_one_or_none() is not None:
        return

    admin = User(
        # ADMIN_USERNAME sert de nom affiche : la variable existait mais
        # n'etait lue nulle part, ce qui la rendait trompeuse.
        first_name=(setting.ADMIN_NAME or "Admin").strip() or "Admin",
        last_name="Emimood",
        email=email,
        password_hash=hash_password(password),
        role=UserRole.admin,
        phone_number="Patrick",
    )

    session.add(admin)
    await session.flush()

    await session.commit()
    logger.info("Bootstrap admin user and profile created: %s", email)
