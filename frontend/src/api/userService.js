import apiClient from "./apiClient";

export const register = async (userData) => {
  const result = await apiClient.post("/users/register", userData);
  return result.data;
};

export const getProfile = async () => {
  const result = await apiClient.get("/users/me");
  return result.data;
};

export const updateProfile = async (newData) => {
  const result = await apiClient.put("/users/me", newData);
};

export const updatePassword = async (password, newPassword) => {
  const result = await apiClient.patch("/users/me/password", {
    new_password: newPassword,
    password: password,
  });
  return result.data;
};

export const listUsers = async () => {
  const result = await apiClient.get("/users");
  return result.data;
};

export const createModerator = async (userData) => {
  const result = await apiClient.post("/users/moderators", userData);
  return result.data;
};

export const deleteUser = async (id) => {
  const result = await apiClient.delete(`/users/${id}`);
  return result.data;
};
