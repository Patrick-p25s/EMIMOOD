import { createDocument, downloadDocument } from "@/api/documentService";
import ProfileStudent from "@/components/special/ProfileStudent";
import useAuth from "@/hooks/useAuth";
import { useMe, useMyDocuments } from "@/hooks/useMe";
import StudentLayout from "@/layout/StudentLayout";
import React, { useEffect } from "react";

export default function MyDashboard() {
  const { user } = useAuth();
  const { getClasse } = useMe();
  const { documents } = useMyDocuments();
  const handleDownload = async (documentId) => {
    try {
      const blob = await downloadDocument(documentId);

      // Crée une URL temporaire pointant vers le blob en mémoire
      const url = window.URL.createObjectURL(blob);

      // Crée un lien invisible et simule le clic
      const link = document.createElement("a");
      link.href = url;
      link.download = documentId; // nom du fichier proposé au téléchargement
      document.body.appendChild(link);
      link.click();

      // Nettoyage
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (data) => {
    try {
      const res = await createDocument(data);
      console.log(res);
    } catch (error) {
      console.log("Erreur ", error.message);
    }
  };
  return (
    <div>
      <StudentLayout
        user={user}
        documents={documents}
        classe={getClasse}
        downloadDoc={handleDownload}
        onCreateDocument={handleCreate}
      />
    </div>
  );
}
