import { documentData, saveDocumentData } from "@/mocks/document";
import { pre } from "framer-motion/client";
import { useState } from "react";

export default function useDocument() {
  const [documents, setDocuments] = useState(documentData);
  const [saved, setSaved] = useState(saveDocumentData);
  const createDocument = async (newDocument, matiereId, ownerId) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const document = {
      id: crypto.randomUUID(),
      titre: newDocument.titre,
      description: newDocument.description || "",
      type_document: newDocument.type_document || "cours",
      date_limite: newDocument.date_limite || null,
      statut: newDocument.proposer_publiquement ? "en_attente" : "prive",
      original_filename: newDocument.file?.name || "sample.pdf",
      storage_key: newDocument.storage_key || "/documents/sample.pdf",
      mime_type: newDocument.file?.type || "application/pdf",
      taille_octets: newDocument.taille_octets || 0,
      matiere_id: matiereId,
      owner_id: ownerId,
      classe_id: newDocument.classe_id || null,
      validated_by_id: null,
      motif_rejet: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDocuments((prev) => [...prev, document]);
    return document;
  };

  const getDocumentByMatiere = async (matiere_id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await documents.filter((doc) => doc.matiere_id === matiere_id);
  };

  const getDocumentByType = async (typeDocument) => {
    const docs = documents.filter(
      (prev) => prev.type_document === typeDocument,
    );
    return docs;
  };

  const getPublicDocument = async () => {
    const docs = documents.filter((doc) => doc.statut === "public");
    return docs;
  };

  const getPendingDocument = async () => {
    const docs = documents.filter((doc) => doc.statut === "en_attente");
    return docs;
  };

  const getDocumentById = (documentId) => {
    return documents.find((doc) => doc.id === documentId);
  };

  const studentDocument = async (studentId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return documents.filter((docs) => docs.owner_id === studentId);
  };

  const saveDocument = async (document_id, user_id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const exist = saved.some(
      (save) => save.document_id === document_id && save.user_id === user_id,
    );
    if (exist) {
      throw new Error("Document déjà enregistré");
    }
    const newDocs = {
      document_id,
      user_id,
      is_favorite: false,
      is_hidden: false,
    };
    return setSaved((prev) => [...prev, newDocs]);
  };

  const valideDocument = async (documentId) => {
    try {
      const document = await getDocumentById(documentId);

      // 2. Vérification sur le statut (et non sur l'id)
      if (document.statut !== "en_attente") {
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
      if (document.statut !== "en_attente") {
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
    saveDocument,
    getDocumentByMatiere,
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
