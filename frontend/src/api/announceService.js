import apiClient from "./apiClient";

export const createAnnonce = async (newAnnonce) => {
  const result = await apiClient.post("/announces", {
    titre: newAnnonce.titre,
    contenu: newAnnonce.contenu,
    important: newAnnonce.important,
  });
  return result.data;
};

export const listAnnonces = async ({ page = 1, pageSize = 20 } = {}) => {
  const result = await apiClient.get("/announces", {
    params: { page, page_size: pageSize },
  });
  return result.data;
};

// export const listActiveAnnonce = async ({ page = 1, pageSize = 20 } = {}) => {
//   const result = await apiClient.get("/announces/active", {
//     params: { page, page_size: pageSize },
//   });
//   return result.data;
// };

// export const listArchivedAnnonce = async ({ page = 1, pageSize = 20 } = {}) => {
//   const result = await apiClient.get("/announces/archive", {
//     params: { page, page_size: pageSize },
//   });
//   return result.data;
// };

export const getAnnonceById = async (id) => {
  const result = await apiClient.get(`/announces/${id}`);
  return result.data;
};

export const archiveAnnonce = async (id) => {
  const result = await apiClient.patch(`/announces/${id}/archive`);
  return result.data;
};

export const activeAnnounce = async (id) => {
  const result = await apiClient.patch(`/announces/${id}/actives`);
  return result.data;
};
