import apiClient from "./apiClient";

export const loginApi = async (email, password) => {
  const formData = { email: email, password: password };
  const response = await apiClient.post("/auth/login", formData);
  return response.data;
};

export const logoutApi = async (token) => {
  const response = await apiClient.post("/auth/logout", token);
  return response.data;
};

export const refreshTokenApi = async (refreshToken) => {
  const response = await apiClient.post("/auth/refresh", refreshToken);
  return response.data;
};
