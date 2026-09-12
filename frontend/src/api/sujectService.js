import apiClient from "./apiClient";

export const createSuject = async (newData) => {
  const result = await apiClient.post("/subjects", newData);
  return result.data;
};

export const listSubjects = async () => {
  const result = await apiClient.get("/subjects");
  return result.data;
};

export const getSubjectById = async (id) => {
  const result = await apiClient.get(`/subjects/${id}`);
  return result.data;
};

export const updateSuject = async (id, newSubjectData) => {
  const result = await apiClient.patch(`/subjects/${id}`, newSubjectData);
  return result.data;
};

export const deleteSubject = async (id) => {
  const result = await apiClient.delete(`/subjects/${id}`);
  return result.data;
};
