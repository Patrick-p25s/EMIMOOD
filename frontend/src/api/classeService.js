import apiClient from "./apiClient";

export const createClasse = async (newClasse) => {
  const result = await apiClient.post("/classes", {
    mention: newClasse.mention,
    niveau: newClasse.niveau,
  });
  return result.data;
};

export const listClasse = async () => {
  const result = await apiClient.get("/classes");
  return result.data;
};

export const regenerateCode = async (id) => {
  const result = await apiClient.patch(`/classes/${id}/regenerate-code`);
  return result.data;
};

export const updateClasse = async (id, newClasse) => {
  const result = await apiClient.patch(`/classes/${id}`, {
    mention: newClasse.mention,
    niveau: newClasse.niveau,
  });
  return result.data;
};

export const deleteClasse = async (id) => {
  const result = await apiClient.delete(`/classes/${id}`);
  return result.data;
};

export const listStudentByClasse = async (id) => {
  const result = await apiClient.get(`/classes/students`);
  return result.data;
};
