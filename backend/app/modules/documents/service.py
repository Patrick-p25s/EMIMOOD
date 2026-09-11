from uuid import UUID

from app.modules.documents.model import Document, DocumentStatus, DocumentType
from app.modules.documents.repository import DocumentRepository
from app.modules.documents.schema import DocumentCreate, DocumentUpdate
from app.modules.documents.storage import save_upload_file
from app.modules.matiere.repository import SubjectRepository
from app.modules.users.model import UserRole, Users
from fastapi import HTTPException, UploadFile, status
from typing import Optional


class DocumentService:
    def __init__(
        self,
        document_repo: DocumentRepository,
        subject_repo: SubjectRepository,
        # save_repo: SauvegardeRepository,
    ):
        self.document_repo = document_repo
        self.subject_repo = subject_repo
        # self.save_repo = save_repo

    def _peut_acceder(self, document: Document, current_user: Users) -> bool:
        if document.statut == DocumentStatus.public:
            return True
        if document.owner_id == current_user.id:
            return True
        if current_user.role == UserRole.admin:
            return True
        return False

    async def _get_document_or_404(self, document_id: UUID) -> Document:
        document = await self.document_repo.get_by_id(document_id)
        if document is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Document introuvable")
        return document

    async def _moderateur_gere_ce_document(
        self, document: Document, current_user: Users
    ) -> bool:
        matiere = await self.subject_repo.get_by_id(document.matiere_id)
        return matiere.classe_id == current_user.classe_id

    def _est_moderateur_de_ce_document(
        self, document: Document, current_user: Users, matiere
    ) -> bool:
        return (
            current_user.role == UserRole.moderator
            and matiere.classe_id == current_user.classe_id
        )

    async def get_document_by_id(
        self, document_id: UUID, current_user: Users
    ) -> Document:
        document = await self._get_document_or_404(document_id)
        if not self._peut_acceder(document, current_user):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
        return document

    async def create_document(
        self,
        matiere_id: UUID | None,
        current_user: Users,
        request: DocumentCreate,
        file: UploadFile,
    ) -> Document:

        if request.date_limite and request.type_document not in (
            DocumentType.td,
            DocumentType.examen,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La date limite ne s'applique qu'aux TD/examens",
            )

        fichier_path, taille_octets = await save_upload_file(file)

        if current_user.role in (UserRole.moderator, UserRole.admin):
            statut = DocumentStatus.public
        elif request.proposer_publiquement:
            statut = DocumentStatus.en_attente
        else:
            statut = DocumentStatus.prive

        data = {
            "titre": request.titre,
            "description": request.description,
            "date_limite": request.date_limite,
            "type_document": request.type_document,
            "statut": statut,
            "fichier_path": fichier_path,
            "mime_type": file.content_type or "application/octet-stream",
            "taille_octets": taille_octets,
            "owner_id": current_user.id,
            "matiere_id": matiere_id,
            "classe_id": current_user.classe_id,
            "validated_by_id": current_user.id
            if statut == DocumentStatus.public
            else None,
        }
        return await self.document_repo.create(data)

    async def telecharger_document(
        self, document_id: UUID, current_user: Users
    ) -> Document:
        document = await self._get_document_or_404(document_id)
        if not self._peut_acceder(document, current_user):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
        return document

    async def list_by_matiere_public(self, matiere_id: UUID) -> list[Document]:
        return await self.document_repo.list_public_by_matiere(matiere_id)

    async def get_document_by_type(self, doc_type: DocumentType) -> list[Document]:
        return await self.document_repo.get_by_type(doc_type)

    async def get_mes_documents(self, current_user: Users) -> list[Document]:
        """Liste tous les documents de l'utilisateur connecté, peu importe leur statut."""
        return await self.document_repo.list_by_owner(current_user.id)

    async def get_all_pending_docs(self, current_user: Users) -> list[Document]:
        if current_user.role == UserRole.admin:
            return await self.document_repo.get_pending()
        if current_user.role == UserRole.moderator:
            return await self.document_repo.get_pending_by_classe(
                current_user.classe_id
            )
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Action réservée aux modérateurs"
        )

    async def _verifier_droit_moderation(
        self, document: Document, current_user: Users
    ) -> None:
        if current_user.role == UserRole.admin:
            return
        if (
            current_user.role == UserRole.moderator
            and await self._moderateur_gere_ce_document(document, current_user)
        ):
            return
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Action réservée au modérateur de cette classe"
        )

    async def valide_document(self, document_id: UUID, current_user: Users) -> Document:
        document = await self._get_document_or_404(document_id)
        await self._verifier_droit_moderation(document, current_user)

        if document.statut != DocumentStatus.en_attente:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, "Document n'est pas en attente"
            )

        return await self.document_repo.update(
            document,
            {"statut": DocumentStatus.public, "validated_by_id": current_user.id},
        )

    async def rejeter_document(
        self, document_id: UUID, current_user: Users
    ) -> Document:
        document = await self._get_document_or_404(document_id)
        await self._verifier_droit_moderation(document, current_user)

        if document.statut != DocumentStatus.en_attente:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, "Document n'est pas en attente"
            )

        return await self.document_repo.update(
            document,
            {"statut": DocumentStatus.rejete, "validated_by_id": current_user.id},
        )

    async def delete_document(self, document_id: UUID, current_user: Users) -> None:
        document = await self._get_document_or_404(document_id)

        est_proprietaire = document.owner_id == current_user.id
        est_admin = current_user.role == UserRole.admin
        est_moderateur_autorise = (
            current_user.role == UserRole.moderator
            and await self._moderateur_gere_ce_document(document, current_user)
        )

        if est_admin or est_moderateur_autorise:
            await self.document_repo.delete(document)
            return

        if est_proprietaire and document.statut != DocumentStatus.public:
            await self.document_repo.delete(document)
            return

        raise HTTPException(status.HTTP_403_FORBIDDEN, "Suppression non autorisée")

    async def update_document(
        self, document_id: UUID, current_user: Users, request: DocumentUpdate
    ) -> Document:
        document = await self._get_document_or_404(document_id)

        est_proprietaire = document.owner_id == current_user.id
        est_admin = current_user.role == UserRole.admin
        est_moderateur_autorise = (
            current_user.role == UserRole.moderator
            and await self._moderateur_gere_ce_document(document, current_user)
        )

        if not (est_proprietaire or est_admin or est_moderateur_autorise):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Modification non autorisée")

        data = request.model_dump(exclude_unset=True)

        # Un propriétaire qui modifie un document déjà tranché doit repasser par la modération
        if est_proprietaire and not (est_admin or est_moderateur_autorise):
            if document.statut in (DocumentStatus.public, DocumentStatus.rejete):
                data["statut"] = DocumentStatus.en_attente
                data["validated_by_id"] = None

        return await self.document_repo.update(document, data)
