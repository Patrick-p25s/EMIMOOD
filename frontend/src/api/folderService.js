import apiClient from "./apiClient";

export const getUsersFolders = async ({ page = 0, pageSize = 20 }) => {
  const response = await apiClient.get("/folder", {
    params: { page, page_size: pageSize },
  });
  return response.data;
};

export const createFolder = async (data) => {
  const response = await apiClient.post("/folder", {
    name: data.name,
    description: data.description,
  });
  return response.data;
};

export const updateFolder = async (id, data) => {
  const response = await apiClient.patch(`/folder/${id}`, {
    name: data.name,
    description: data.description,
  });
  return response.data;
};

export const deleteFolder = async (id) => {
  const response = await apiClient.delete(`/folder/${id}`);
  return response.data;
};

export const getFolderById = async (id) => {
  const response = await apiClient.get(`/folder/${id}`);
  return response.data;
};
