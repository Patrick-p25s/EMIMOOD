import apiClient from "./apiClient";

export const login = async (email, password) => {
  const formData = { email: email, password: password };
  const response = await apiClient.post("/auth/login", formData);
  return response.data;
};

export const register = async (formData) => {
  const response = await apiClient.post("/user/register", formData);
  return response.data;
};

export const logout = async (token) => {
  const response = await apiClient.post("/auth/logout", token);
  return response.data;
};
export const refreshToken = async (refreshToken) => {
  const response = await apiClient.post("/auth/refresh", refreshToken);
  return response.data;
};
export const getCurrentUser = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};
