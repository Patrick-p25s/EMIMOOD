// utils/file.js
export const getFileUrl = (fichierPath) => {
  if (!fichierPath) return null;
  return `http://localhost:8000/${fichierPath}`;
};
