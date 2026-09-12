import apiClient from "./apiClient";

export const createYear = async (newYear) => {
  const result = await apiClient.post("/year", {
    label: newYear.label,
    start_at: newYear.startAt,
    end_at: newYear.endAt,
  });
  return result.data;
};

export const listYear = async ({ page = 1, pageSize = 20 } = {}) => {
  const result = await apiClient.get("/year", {
    params: { page, page_size: pageSize },
  });
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
  await apiClient.delete(`/year/${id}`);
};

export const getClasseByYear = async (id, { page = 1, pageSize = 20 } = {}) => {
  const result = await apiClient.get(`/year/${id}/classes`, {
    params: { page, page_size: pageSize },
  });
  return result.data;
};
