// Même interface que ton ancien tokenStorage (get/set/clear),
// mais RIEN n'est jamais écrit sur disque — la valeur vit seulement
// en mémoire JS, effacée au moindre refresh de page.
let accessToken = null;

export const authMemory = {
  get: () => accessToken,
  set: (token) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
};
