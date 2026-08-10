import { apiClient } from "./apiClient";

export const register = async (userData) => {
  const response = await apiClient.post("/users/register", userData);
  return response.data;
};

export const refresh = async (refresh_token: string) => {
  const response = await apiClient.post("/auth/refresh", { refresh_token });
  return response.data;
};

export const logout = async (token: string) => {
  const response = await apiClient.post("/auth/logout", { token });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};
