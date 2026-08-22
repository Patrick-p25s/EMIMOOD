import DocumentCard from "@/components/shared/DocumentCard";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import DocumentUploadDialog from "../../components/special/DocumentUploadDialog";
import useAuth from "@/hooks/useAuth";
export default function DocumentModerator() {
  const {
    allDocuments,
    allSubjects,
    createDocument,
    deleteDocument,
    valideDocument,
    rejeteDocument,
  } = useOutletContext();

  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleEdit = async () => {
    return null;
  };

  const handleValide = async (document) => {
    setLoading(true);
    try {
      await valideDocument(document.id);
    } catch (error) {
      setErreur(`Erreur ${error.message.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRejete = async (document) => {
    setErreur(null);

    const documentId = document?.id || document;
    if (!documentId) return;

    if (
      !window.confirm(
        "Voulez-vous vraiment rejeter cet document de la classe ?",
      )
    )
      return;
    setLoading(true);
    try {
      await rejeteDocument(documentId);
    } catch (error) {
      setErreur(`Erreur ${error.message.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    setLoading(true);
    setErreur(null);
    if (documentId) {
      try {
        await deleteDocument(documentId);
      } catch (error) {
        setErreur(`Erreur : ${error.message.toString()}`);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="spacstudentByClassee-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Gestion des documents</h1>
        <ButtonStyled onClick={() => setOpen(true)} loading={loading}>
          Ajouter un documents
        </ButtonStyled>
      </div>
      <DocumentUploadDialog
        open={open}
        onOpenChange={setOpen}
        onCreate={createDocument}
        matieres={allSubjects}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allDocuments.map((document) => (
          <DocumentCard
            onRejete={() => handleRejete(document)}
            onValide={() => handleValide(document)}
            key={document.id}
            document={document}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
