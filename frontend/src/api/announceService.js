import apiClient from "./apiClient";

export const createAnnonce = async (newAnnonce) => {
  const result = await apiClient.post("/announces", newAnnonce);
  return result.data;
};

export const listAnnonces = async () => {
  const result = await apiClient.get("/announces");
  return result.data;
};

export const listActiveAnnonce = async () => {
  const result = await apiClient.get("/announces/active");
  return result.data;
};

export const listArchivedAnnonce = async () => {
  const result = await apiClient.get("/announces/archive");
  return result.data;
};

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
