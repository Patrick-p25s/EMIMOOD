import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base_model import UuidStamp

if TYPE_CHECKING:
    from app.modules.classes.model import Classe
    from app.modules.documents.model import Document


class Subject(UuidStamp):
    __tablename__ = "subject"

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    coefficient: Mapped[int] = mapped_column(
        Integer,
        default=3,
        nullable=False,
    )

    semester: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    classe_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("classe.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Relations
    classe: Mapped["Classe"] = relationship(
        "Classe",
        back_populates="subjects",
    )

    documents: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="matiere",
    )

    __table_args__ = (
        UniqueConstraint(
            "classe_id",
            "name",
            name="uq_classe_subject_name",
        ),
    )