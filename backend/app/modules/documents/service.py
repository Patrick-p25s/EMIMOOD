from uuid import UUID

from app.modules.documents.model import Document, DocumentStatus, DocumentType
from app.modules.documents.repository import DocumentRepository, DocumentSaveRepository
from app.core.pagination import Page, PaginationParams, make_page
from app.modules.documents.schema import DocumentCreate, DocumentUpdate
from app.modules.documents.storage import save_upload_file
from app.modules.matiere.repository import SubjectRepository
from app.modules.users.model import UserRole, Users
from fastapi import HTTPException, UploadFile, status


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

        if matiere_id is not None:
            matiere = await self.subject_repo.get_by_id(matiere_id)
            if matiere is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Matière introuvable")
            if (
                current_user.role != UserRole.admin
                and matiere.classe_id != current_user.classe_id
            ):
                raise HTTPException(
                    status.HTTP_403_FORBIDDEN,
                    "Cette matière n'appartient pas à votre classe",
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
            "original_filename": file.filename or "document",
            "storage_key": fichier_path,
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

    async def list_public_documents(
        self,
        current_user: Users,
        params: PaginationParams,
        matiere_id: UUID | None = None,
        document_type: DocumentType | None = None,
    ) -> Page:
        documents, total = await self.document_repo.list_public(
            current_user.classe_id,
            matiere_id,
            document_type,
            params.offset,
            params.limit,
        )
        return make_page(documents, total, params)

    def _require_moderator(self, current_user: Users) -> None:
        if current_user.role not in (UserRole.moderator, UserRole.admin):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")

    def _can_moderate_document(self, document: Document, current_user: Users) -> bool:
        return current_user.role == UserRole.admin or (
            current_user.role == UserRole.moderator
            and document.classe_id == current_user.classe_id
        )

    async def list_pending_documents(
        self,
        current_user: Users,
        params: PaginationParams,
        matiere_id: UUID | None = None,
    ) -> Page:
        self._require_moderator(current_user)
        documents, total = await self.document_repo.list_pending(
            None if current_user.role == UserRole.admin else current_user.classe_id,
            matiere_id,
            params.offset,
            params.limit,
        )
        return make_page(documents, total, params)

    async def get_not_private_document(
        self, current_user: Users, params: PaginationParams
    ):
        self._require_moderator(current_user)
        result, total = await self.document_repo.not_private_doc(
            current_user.classe_id, params.offset, params.limit
        )
        return make_page(result, total, params)

    async def get_rejected_docs(
        self, current_user: Users, matiere_id: str | None = None
    ):
        self._require_moderator(current_user)

        return await self.document_repo.get_all_rejected(
            current_user.classe_id, matiere_id
        )

    async def valide_document(self, document_id: UUID, current_user: Users) -> Document:
        document = await self._get_document_or_404(document_id)

        self._require_moderator(current_user)
        if not self._can_moderate_document(document, current_user):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")

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

        self._require_moderator(current_user)
        if not self._can_moderate_document(document, current_user):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")

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
        est_moderateur = self._can_moderate_document(document, current_user)

        if est_moderateur:
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
            document.owner_id == current_user.id
            and document.statut != DocumentStatus.public
        )
        est_moderateur = self._can_moderate_document(document, current_user)

        if not (est_proprietaire or est_moderateur):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Modification non autorisée")

        data = request.model_dump(exclude_unset=True)

        return await self.document_repo.update(document, data)

    """
    SERVICE POUR TOUS LES SAUVEGARDE DEPUIS ICI
    """

    async def sauvegarde_document(self, document_id: str | UUID, current_user: Users):
        document = await self._get_document_or_404(document_id)
        if document.statut != DocumentStatus.public:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Erreur lors de sauvegarde")

        if await self.save_repo.get_by_user_and_document(current_user.id, document.id):
            raise HTTPException(status.HTTP_409_CONFLICT, "Document déjà sauvegardé")

        new_save = {"user_id": current_user.id, "document_id": document.id}
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
        saved = await self.get_save_by_id(id, current_user)
        return await self.save_repo.delete(saved)

    async def list_my_documents(
        self, current_user: Users, params: PaginationParams
    ) -> Page:
        documents, total = await self.document_repo.list_by_owner(
            current_user.id, params.offset, params.limit
        )
        return make_page(documents, total, params)
