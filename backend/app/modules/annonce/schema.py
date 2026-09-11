from datetime import datetime
from uuid import UUID

from app.modules.annonce.model import AnnonceStatut
from pydantic import BaseModel


class AnnonceCreate(BaseModel):
    titre: str
    contenu: str
    important: bool = False


class AnnonceOut(BaseModel):
    id: UUID
    titre: str
    contenu: str
    important: bool
    statut: AnnonceStatut
    classe_id: UUID | None
    auteur_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class LecteurStats(BaseModel):
    total_etudiants: int
    total_lu: int
    non_lecteurs_ids: list[UUID]
