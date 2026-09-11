from uuid import UUID

from app.modules.documents.model import Document, DocumentStatus, DocumentType
from app.modules.documents.repository import DocumentRepository, DocumentSaveRepository
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
        save_repo: DocumentSaveRepository,
    ):
        self.document_repo = document_repo
        self.subject_repo = subject_repo
        self.save_repo = save_repo

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

    async def get_public_docs(self, current_user: Users):
        docs = await self.document_repo.get_all_public(current_user.classe_id)

        return docs

    """
    ACTION DE MODERATEUR DE L'APPLICATION
    """

    def _is_admin(self, current_user: Users):
        if current_user.role != "student":
            return True
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès réfusé")

    async def get_document_by_type(self, doc_type: DocumentType) -> list[Document]:
        return await self.document_repo.get_by_type(doc_type)

    async def get_all_pending_docs(
        self, current_user: Users, matiere_id: str | None = None
    ) -> list[Document]:
        docs = await self.document_repo.get_pending_docs(
            current_user.classe_id, matiere_id
        )
        return docs

    async def get_rejected_docs(
        self, current_user: Users, matiere_id: str | None = None
    ):
        self._is_admin(current_user)

        return await self.document_repo.get_all_rejected(
            current_user.classe_id, matiere_id
        )

    async def valide_document(self, document_id: UUID, current_user: Users) -> Document:
        document = await self._get_document_or_404(document_id)

        self._is_admin(current_user)

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

        self._is_admin(current_user)

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
        est_admin = self._is_admin(current_user)

        if est_admin and document.statut != "prive":
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

        est_proprietaire = (
            document.owner_id == current_user.id and document.statut != "public"
        )
        est_admin = self._is_admin(current_user)

        if not (est_proprietaire or est_admin):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Modification non autorisée")

        data = request.model_dump(exclude_unset=True)

        return await self.document_repo.update(document, data)

    """
    SERVICE POUR TOUS LES SAUVEGARDE DEPUIS ICI
    """

    async def sauvegarde_document(self, document_id: str | UUID, current_user: Users):
        document = await self._get_document_or_404(document_id)
        if document.statut != "public":
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Erreur lors de sauvegarde")

        new_save = {"user_id": current_user.id, "document_id": document_id}
        return await self.save_repo.create(new_save)

    async def get_save_by_id(self, id: str, current_user: Users):
        saved = await self.save_repo.get_by_id(id)
        if saved is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Document non trouvé")
        if saved.user_id != current_user.id:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN, "Vous n'avez acces a cette document"
            )

        return saved

    async def delete_save_document(self, id: str, current_user: Users):
        saved = self.get_save_by_id(id, current_user)
        return await self.save_repo.delete(saved)

    async def get_my_documents(self, current_user: Users):
        upload = await self.document_repo.get_all_my_docs(current_user.id)
        saved = await self.save_repo.list_by_owner(current_user.id)
        return upload + saved
