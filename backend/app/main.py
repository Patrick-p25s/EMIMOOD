import logging
import contextlib
import asyncio
from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import setting
from app.core.database import engine, Base, SessionLocal
from app.core.bootstrap_db import ensure_admin_user1
from app.core.logging import configure_logging
from app.users.router import router as user_router
from app.auth.router import router as auth_router
from app.years.router import router as year_router
from app.classes.router import router as classe_router

configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    if setting.AUTOCREATE_TABLE:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        try:
            await ensure_admin_user1(session)
        except Exception:
            # Journalise : sans cela, un echec ici laisse demarrer l'app sans
            # administrateur, et toutes les routes admin repondent 403 sans
            # que rien n'indique pourquoi.
            logger.exception("Echec de creation de l'administrateur au demarrage")
            await session.rollback()

    # worker_task = asyncio.create_task(_run_code_expiry_worker())

    yield

    # worker_task.cancel()
    # with contextlib.suppress(asyncio.CancelledError):
    #     await worker_task


app = FastAPI(lifespan=lifespan)


@app.get("/")
def index():
    return {"message": f"{setting.ADMIN_EMAIL} {setting.ADMIN_PASSWORD}"}


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(year_router)
app.include_router(classe_router)
