export const tokenStorage = {
  get: () => localStorage.getItem("TOKEN"),
  set: (token) => localStorage.setItem("TOKEN", token),
  clear: () => localStorage.removeItem("TOKEN"),
};
