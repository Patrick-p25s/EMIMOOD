import apiClient from "./apiClient";

export const createDocument = async (documentData) => {
  const formData = new FormData();
  formData.append("titre", documentData.titre);
  formData.append("file", documentData.file);
  formData.append("proposer_publiquement", documentData.proposerPubliquement);
  formData.append("type_document", documentData.typeDocument);

  if (documentData.description) {
    formData.append("description", documentData.description);
  }

  if (formData.dateLimite) {
    formData.append("date_limite", documentData.dateLimite);
  }

  if (formData.matiereId) {
    formData.append("matiere_id", documentData.matiereId);
  }

  const result = await apiClient.post("/documents", formData);
  return result.data;
};

export const getPublicDocuments = async ({
  page = 1,
  pageSize = 20,
  matiereId = null,
} = {}) => {
  const result = await apiClient.get(`/documents/public`, {
    params: { page, page_size: pageSize, matiere_id: matiereId },
  });
  return result.data;
};

export const getNotPrivateDocs = async ({
  page = 1,
  pageSize = 20,
  search = null,
  typeDocument = null,
  classeId = null,
} = {}) => {
  const result = await apiClient.get("/documents", {
    params: {
      page,
      page_size: pageSize,
      document_type: typeDocument,
      classe_id: classeId,
      search: search,
    },
  });
  return result.data;
};

export const pendingDocuments = async ({
  page = 1,
  pageSize = 20,
  matiereId = null,
  typeDocument = null,
} = {}) => {
  const result = await apiClient.get("/documents/moderation/pending", {
    params: {
      page,
      page_size: pageSize,
      matiere_id: matiereId,
      type_document: typeDocument,
    },
  });
  return result.data;
};

export const approveDocument = async (documentId) => {
  const result = await apiClient.patch(
    `/documents/moderation/${documentId}/approve`,
  );
  return result.data;
};

export const rejectDocument = async (documentId) => {
  const result = await apiClient.patch(
    `/documents/moderation/${documentId}/reject`,
  );
  return result.data;
};

export const updateDocument = async (documentId, documentData) => {
  const result = await apiClient.patch(`/documents/${documentId}`, {
    titre: documentData.titre,
    description: documentData.description,
    date_limite: documentData.dateLimite,
    type_document: documentData.typeDocument,
  });
  return result.data;
};

export const deleteDocument = async (documentId) => {
  const result = await apiClient.delete(`/documents/${documentId}`);
  return result.data;
};

export const myDocument = async ({ page = 1, pageSize = 20 } = {}) => {
  const result = await apiClient.get("/documents/mine", {
    params: { page, page_size: pageSize },
  });
  return result.data;
};

export const saveDocument = async (documentId) => {
  const result = await apiClient.post(`/documents/${documentId}/saves`);
  return result.data;
};

export const deleteDocumentSaved = async (documentId) => {
  const result = await apiClient.delete(`/documents/saves/${documentId}`);
  return result.data;
};

export const getStats = async (userId = null) => {
  const result = await apiClient.get("/documents/stats", {
    params: { user_id: userId },
  });
  return result.data;
};

export const getDocumentById = async (documentId) => {
  const result = await apiClient.get(`/documents/${documentId}`);
  return result.data;
};

export const downloadDocument = async (documentId) => {
  const result = await apiClient.get(`/documents/${documentId}/download`, {
    responseType: "blob",
  });
  return result.data;
};

export const getSaveById = async (doucmentId) => {
  const result = await apiClient.get(`/documents/${doucmentId}/saves`);
  return result.data;
};

export const moveDocument = async (documentId, folderId) => {
  const result = await apiClient.patch(`/documents/${documentId}/move`, {
    folder_id: folderId,
  });
  return result.data;
};

export const getSavedByFolder = async (folderId) => {
  const result = await apiClient.get(`/documents/${folderId}/documents`);
  return result.data;
};
