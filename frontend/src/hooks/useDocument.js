import { documentData } from "@/fake/document";
import { useState } from "react";

export default function useDocument() {
  const [documents, setDocuments] = useState(documentData);
  const createDocument = async (newDocument, matierId, ownerId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const document = {
      id: crypto.randomUUID(),
      titre: newDocument.titre,
      type_document: newDocument.type_document,
      date_limite: newDocument.date_limite,
      proposer_publique: newDocument.proposer_publique,
      matier_id: matierId,
      owner_id: ownerId,
    };
    setDocuments([...documents, document]);
  };

  const getDocumentByType = async (typeDocument) => {
    const docs = documents.filter(
      (prev) => prev.type_document === typeDocument,
    );
    return docs;
  };

  const getPublicDocument = async () => {
    const docs = documents.filter((doc) => doc.statut === "publique");
    return docs;
  };

  const getPendingDocument = async () => {
    const docs = documents.filter((doc) => doc.statut === "pending");
    return docs;
  };

  const getDocumentById = async (documentId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return documents.find((doc) => doc.id === documentId);
  };

  const valideDocument = async (documentId) => {
    try {
      // 1. Récupération du document
      const document = await getDocumentById(documentId);

      // 2. Vérification sur le statut (et non sur l'id)
      if (document.statut !== "pending") {
        throw new Error("Ce document n'est plus en attente");
      }

      // 3. Objet document mis à jour
      const updatedDocument = { ...document, statut: "publique" };

      // 4. Mise à jour propre de l'état React avec un .map()
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === documentId ? updatedDocument : doc,
        ),
      );
    } catch (error) {
      console.error("Erreur lors de la validation :", error.message);
    }
  };

  const rejeteDocument = async (documentId) => {
    try {
      // 1. Récupération du document
      const document = await getDocumentById(documentId);

      // 2. Vérification sur le statut (et non sur l'id)
      if (document.statut !== "pending") {
        throw new Error("Ce document n'est plus en attente");
      }

      // 3. Objet document mis à jour
      const updatedDocument = { ...document, statut: "rejete" };

      // 4. Mise à jour propre de l'état React avec un .map()
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === documentId ? updatedDocument : doc,
        ),
      );
    } catch (error) {
      console.error("Erreur lors de la validation :", error.message);
    }
  };

  const getMyDocument = async (userId) => {
    const docs = documents.filter((doc) => doc.owner_id === userId);
    return docs;
  };
  return {
    documents,
    createDocument,
    getDocumentById,
    getDocumentByType,
    getPendingDocument,
    getPublicDocument,
    getMyDocument,
    rejeteDocument,
    valideDocument,
  };
}
