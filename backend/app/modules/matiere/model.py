import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp
from app.core.database import Base

if TYPE_CHECKING:
    from app.modules.classes.model import Classe
    from app.modules.documents.model import Document


class Matiere(UuidStamp, Base):
    __tablename__ = "matieres"

    nom: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    class_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("classes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    classe: Mapped["Classe"] = relationship(
        "Classe",
        back_populates="matieres",
    )

    documents: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="matiere",
    )

    __table_args__ = (
        UniqueConstraint(
            "class_id",
            "nom",
            name="uq_matiere_class_nom",
        ),
    )