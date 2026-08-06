import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.auth.router import router as auth_router
from app.classes.router import router as classe_router
from app.core.bootstrap_db import ensure_admin_user1
from app.core.config import setting
from app.core.database import Base, SessionLocal, engine
from app.core.logging import configure_logging
from app.documents.router import router as docs_router
from app.matiere.router import router as subject_router
from app.sauvegarde.router import router as save_router
from app.users.router import router as user_router
from app.years.router import router as year_router
from app.annonce.router import router as annonce_router

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
            logger.exception("Échec de la création de l'administrateur au démarrage")
            await session.rollback()

    yield


tags_metadata = [
    {
        "name": "Authentification & Jetons",
        "description": "Gestion des accès, création et rafraîchissement des tokens JWT.",
    },
    {
        "name": "Gestion des Utilisateurs",
        "description": "Inscription, gestion des profils et administration des comptes.",
    },
    {
        "name": "Gestion des Années Académiques",
        "description": "Administration des années universitaires et activation des sessions.",
    },
    {
        "name": "Gestion des Classes",
        "description": "Gestion des parcours, classes et codes d'invitation.",
    },
    {
        "name": "Gestion des Matières",
        "description": "Organisation des unités d'enseignement rattachées aux classes.",
    },
    {
        "name": "Gestion des Documents",
        "description": "Publication, modération (validation/rejet) et téléchargement des cours/examens.",
    },
    {
        "name": "Sauvegardes & Tableau de bord",
        "description": "Espace personnel des étudiants pour la mise en favoris des documents.",
    },
]


app = FastAPI(
    title="EmiMood API Documentation",
    version="1.0.0",
    openapi_tags=tags_metadata,
    lifespan=lifespan,
    swagger_ui_parameters={"persistAuthorization": True},
)

# Inclusion des routeurs
app.include_router(year_router)
app.include_router(classe_router)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(subject_router)
app.include_router(docs_router)
app.include_router(save_router)
app.include_router(annonce_router)
