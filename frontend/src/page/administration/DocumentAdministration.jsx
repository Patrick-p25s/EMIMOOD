import DocumentCard from "@/components/features/documents/DocumentCard";
import React, { useEffect, useState } from "react";
import DocumentUploadDialog from "@/components/features/documents/DocumentUploadDialog";
import DocumentFilterBar from "@/components/features/documents/DocumentFilterBar";
import useDocument from "@/hooks/useDocument";
import FormModal from "@/components/common/forms/FormModal";
import InputLabeled from "@/components/common/forms/InputLabeled";
import SelectLabeled from "@/components/common/forms/SelectLabeled";
import TextareaLabeled from "@/components/common/forms/TextareaLabeled";
import { Skeleton } from "@/components/ui/skeleton";
import { FilePlus2, FileText } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import AlertBox from "@/components/common/feedback/AlertBox";
import { EmptyCard } from "@/components/common/feedback/EmptyCard";
import { getErrorMessage } from "@/utils/getErrorMessage";
import AdminPageHeader from "@/components/features/admin/AdminPageHeader";
import AdminPagination from "@/components/features/admin/AdminPagination";

export default function DocumentAdministration({ classes = [] }) {
  const {
    documents,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    goToPage,
    add,
    remove,
    update,
    reject,
    approve,
  } = useDocument(1, 3);

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "admin";

  const [open, setOpen] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editDoc, setEditDoc] = useState({
    titre: "",
    description: "",
    dateLimite: "",
    typeDocument: "",
  });
  const isAssignment = ["td", "tp", "devoir"].includes(editDoc.typeDocument);
  const [edited, setEdited] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    if (edited !== null) {
      setEditDoc({
        titre: edited.titre || "",
        description: edited.description || "",
        typeDocument: edited.type_document,
      });
    }
  }, [edited]);

  const handleEdit = async () => {
    setErreur(null);
    try {
      const updated = await update(edited.id, editDoc);
      setEdited(null);
      return updated;
    } catch (err) {
      setErreur(getErrorMessage(err));
    }
  };

  const handleValide = async (document) => {
    setActionLoading(true);
    try {
      await approve(document.id);
    } catch (error) {
      setErreur(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejete = async (document) => {
    setErreur(null);
    const documentId = document?.id || document;
    if (!documentId) return;
    if (!window.confirm("Voulez-vous vraiment rejeter ce document ?")) return;

    setActionLoading(true);
    try {
      await reject(documentId);
    } catch (error) {
      setErreur(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    setActionLoading(true);
    setErreur(null);
    if (documentId) {
      try {
        await remove(documentId);
      } catch (error) {
        setErreur(getErrorMessage(error));
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <AdminPageHeader icon={FileText} title="Documents" description="Centralisez, validez et organisez les documents pédagogiques." meta={`${pagination.total} document${pagination.total > 1 ? "s" : ""} au total`} actionLabel="Ajouter un document" actionIcon={<FilePlus2 className="size-4" />} onAction={() => setOpen(true)} actionLoading={actionLoading} />

      <DocumentFilterBar
        filters={filters}
        onChange={updateFilters}
        classes={classes}
        showClasseFilter={isSuperAdmin}
      />

      <DocumentUploadDialog open={open} onOpenChange={setOpen} onCreate={add} />

      {erreur && (
        <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm">
          {erreur}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <AlertBox variant="error" title="Une erreur se produit">
          {getErrorMessage(error)}
        </AlertBox>
      ) : documents.length === 0 ? (
        <EmptyCard
          title="Aucun document ne correspond à ces critères."
          icon={FileText}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((document) => (
            <DocumentCard
              onRejete={() => handleRejete(document)}
              onValide={() => handleValide(document)}
              key={document.id}
              document={document}
              onEdit={() => {
                setEdited(document);
                setOpenEdit(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AdminPagination pagination={pagination} onPageChange={goToPage} />

      <FormModal
        onOpenChange={setOpenEdit}
        open={openEdit}
        onSubmit={handleEdit}
        loading={loading}
        error={erreur}
        title="Modifier un document"
        submitLabel="Enregistrer"
      >
        <InputLabeled
          label="Titre du document"
          name="titre"
          value={editDoc.titre}
          setValue={setEditDoc}
          placeholder="Ex: TD1 - Structures de données"
          required
        />

        <SelectLabeled
          placeholder="Sélectionner le type"
          value={editDoc.typeDocument}
          setValue={setEditDoc}
          options={[
            { value: "cours", label: "Cours" },
            { value: "td", label: "Travaux dirigés" },
            { value: "tp", label: "Travaux pratiques" },
            { value: "examen", label: "Examen" },
          ]}
          id="typeDocument"
        />
        {isAssignment && (
          <InputLabeled
            label="Date limite de rendu (Optionnelle)"
            type="datetime-local"
            value={editDoc.dateLimite}
            setValue={setEditDoc}
            name="dateLimite"
          />
        )}

        <TextareaLabeled
          label="Description (Optionnelle)"
          id="description"
          name="description"
          value={editDoc.description}
          setValue={setEditDoc}
          placeholder="Informations ou consignes relatives au document..."
        />
      </FormModal>
    </div>
  );
}
