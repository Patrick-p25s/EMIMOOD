import apiClient from "./apiClient";

export const createAnnonce = async (newAnnonce) => {
  const result = await apiClient.post("/annonces", {
    titre: newAnnonce.titre,
    contenu: newAnnonce.contenu,
    important: newAnnonce.important,
  });
  return result.data;
};

export const listAnnonces = async ({ page = 1, pageSize = 20 } = {}) => {
  const result = await apiClient.get("/annonces", {
    params: { page, page_size: pageSize },
  });
  return result.data;
};

export const listActiveAnnonce = async ({ page = 1, pageSize = 20 } = {}) => {
  const result = await apiClient.get("/annonces/active", {
    params: { page, page_size: pageSize },
  });
  return result.data;
};

// export const listArchivedAnnonce = async ({ page = 1, pageSize = 20 } = {}) => {
//   const result = await apiClient.get("/annonces/archive", {
//     params: { page, page_size: pageSize },
//   });
//   return result.data;
// };

export const getAnnonceByIdRead = async (id) => {
  const result = await apiClient.get(`/annonces/${id}`);
  return result.data;
};

export const alreadyRead = async (id) => {
  const result = await apiClient.get(`/annonces/read/${id}`);
  return result.data;
};

export const updateAnnonce = async (id, data) => {
  const result = await apiClient.patch(`/annonces/${id}/update`, {
    titre: data.titre,
    contenu: data.contenu,
    import: data.import,
  });
  return result.data;
};

export const deleteAnnonce = async (id) => {
  const result = await apiClient.delete(`/annonces/${id}/delete`);
  return result.data;
};

export const archiveAnnonce = async (id) => {
  const result = await apiClient.patch(`/annonces/${id}/archive`);
  return result.data;
};

export const activeAnnounce = async (id) => {
  const result = await apiClient.patch(`/annonces/${id}/actives`);
  return result.data;
};
