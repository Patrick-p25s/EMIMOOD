import apiClient from "./apiClient";

export const createYear = async (newYear) => {
  const result = await apiClient.post("/year", newYear);
};

export const listYear = async () => {
  const result = await apiClient.get("/year");
  return result.data;
};

export const getYearById = async (id) => {
  const result = await apiClient.get(`/year/${id}`);
  return result.data;
};

export const activeYear = async (id) => {
  const result = await apiClient.patch(`/year/${id}`);
  return result.data;
};

export const deleteYear = async (id) => {
  const result = await apiClient.delete(`/year/${id}`);
  return result.data;
};

export const getClasseByYear = async (id) => {
  const result = await apiClient.get(`/year/${id}/classe`);
};
