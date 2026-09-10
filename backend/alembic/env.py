import asyncio
from logging.config import fileConfig

from alembic import context
from app.core.config import setting
from app.core.database import Base
from app.modules.users.model import Users
from app.modules.auth.model import RefreshSession
from app.modules.years.model import YearUniv
from app.modules.classes.model import Classe
from app.modules.matiere.model import Subject
from app.modules.documents.model import Document, DocumentSauvegarde
from sqlalchemy import pool
from app.modules.annonces.model import Annonce, AnnonceLecture

# Importation pour le moteur asynchrone
from sqlalchemy.ext.asyncio import async_engine_from_config

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Liaison de vos modèles à Alembic
target_metadata = Base.metadata

config.set_main_option("sqlalchemy.url", setting.DATABASE_URL)


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    """Fonction synchrone appelée à l'intérieur du contexte asynchrone."""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Version asynchrone pour exécuter les migrations en ligne."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        # On utilise connection.run_sync pour exécuter le code synchrone d'Alembic
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    # Exécution de la fonction asynchrone dans la boucle d'événements
    asyncio.run(run_migrations_online())
