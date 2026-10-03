import axios from "axios";
import { authMemory } from "./authMemory";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // essentiel : envoie le cookie httpOnly refresh_token
});

apiClient.interceptors.request.use((config) => {
  const token = authMemory.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

function settlePendingRequests(error, newToken) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  pendingRequests = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");
    const isLoginCall = originalRequest?.url?.includes("/auth/login");

    // Un identifiant invalide ne doit jamais déclencher un refresh : cela masque
    // l'erreur de connexion et peut provoquer une redirection inutile.
    if (!isUnauthorized || isRefreshCall || isLoginCall || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((newToken) => {
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      // Requête brute (pas apiClient) pour éviter de re-déclencher cet intercepteur
      const res = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      const newToken = res.data.accessToken;

      authMemory.set(newToken);
      settlePendingRequests(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      settlePendingRequests(refreshError);
      authMemory.clear();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
