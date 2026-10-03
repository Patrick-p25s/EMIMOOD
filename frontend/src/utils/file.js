// utils/file.js
export const getFileUrl = (fichierPath) => {
  if (!fichierPath) return null;
  if (/^https?:\/\//i.test(fichierPath)) return fichierPath;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${apiUrl.replace(/\/$/, "")}/${fichierPath.replace(/^\//, "")}`;
};
