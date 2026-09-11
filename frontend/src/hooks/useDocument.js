import { documentData } from "@/mocks/document";
import { useState } from "react";

export default function useDocument() {
  const [documents, setDocuments] = useState(documentData);
  const createDocument = async (newDocument, matiereId, ownerId) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const document = {
      id: crypto.randomUUID(),
      titre: newDocument.titre,
      description: newDocument.description || "",
      type_document: newDocument.type_document || "cours",
      date_limite: newDocument.date_limite || null,
      proposer_publique: Boolean(newDocument.proposer_publique),
      statut: newDocument.proposer_publique ? "validated" : "pending",
      fichier_path: newDocument.fichier_path || "/documents/sample.pdf",
      mime_type: newDocument.file?.type || "application/pdf",
      taille_octets: newDocument.taille_octets || 0,
      matiere_id: matiereId,
      owner_id: ownerId,
      created_at: new Date().toISOString(),
    };

    setDocuments((prev) => [...prev, document]);
    return document;
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

  const getDocumentById = (documentId) => {
    return documents.find((doc) => doc.id === documentId);
  };

  const studentDocument = async (studentId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return documents.filter((docs) => docs.owner_id === studentId);
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
      const updatedDocument = { ...document, statut: "public" };

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

  const deleteDocument = async (documentId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return setDocuments((prev) =>
      prev.filter((document) => document.id !== documentId),
    );
  };

  const getMyDocument = async (userId) => {
    const docs = documents.filter((doc) => doc.owner_id === userId);
    return docs;
  };

  return {
    documents,
    studentDocument,
    deleteDocument,
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
