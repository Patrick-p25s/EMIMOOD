import apiClient from "./apiClient";

export const createSuject = async (newData) => {
  const result = await apiClient.post("/subjects", {
    name: newData.name,
    description: newData.description,
    semester: newData.semester,
    coefficient: newData.coefficient,
  });
  return result.data;
};

export const listSubjects = async ({ page = 1, pageSize = 20 } = {}) => {
  const result = await apiClient.get("/subjects", {
    params: { page, page_size: pageSize },
  });
  return result.data;
};

export const getSubjectById = async (id) => {
  const result = await apiClient.get(`/subjects/${id}`);
  return result.data;
};

export const updateSuject = async (id, newSubjectData) => {
  const result = await apiClient.put(`/subjects/${id}`, newSubjectData);
  return result.data;
};

export const deleteSubject = async (id) => {
  const result = await apiClient.delete(`/subjects/${id}`);
  return result.data;
};
