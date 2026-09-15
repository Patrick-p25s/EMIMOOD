import apiClient from "./apiClient";

export const register = async (userData) => {
  const result = await apiClient.post("/users/register", {
    first_name: userData.firstName,
    last_name: userData.lastName,
    phone_number: userData.phoneNumber,
    matricule: userData.matricule,
    email: userData.email,
    password: userData.password,
    code_invitation: userData.codeInvitation,
  });
  return result.data;
};

export const getProfile = async () => {
  const result = await apiClient.get("/users/me");
  return result.data;
};

export const updateProfile = async (userId = null, newData) => {
  const params = userId ? { user_id: userId } : {};
  const result = await apiClient.put(
    "/users/me",
    {
      first_name: newData.firstName,
      last_name: newData.lastName,
      email: newData.email,
      phone_number: newData.phoneNumber,
    },
    { params },
  );
  return result.data;
};

export const updatePassword = async (password, newPassword) => {
  const result = await apiClient.patch("/users/me/password", {
    new_password: newPassword,
    password: password,
  });
  return result.data;
};

export const listUsers = async ({ page = 0, pageSize = 20 } = {}) => {
  const result = await apiClient.get("/users", {
    params: { page, page_size: pageSize },
  });
  return result.data;
};

export const createModerator = async (userData, classeId) => {
  const result = await apiClient.post(`/users/${classeId}/moderators`, {
    first_name: userData.firstName,
    last_name: userData.lastName,
    email: userData.email,
    password: userData.password,
    phone_number: userData.phoneNumber,
    matricule: userData.matricule,
  });
  return result.data;
};

export const deleteUser = async (id) => {
  const result = await apiClient.delete(`/users/${id}`);
  return result.data;
};

export const getUserClasse = async (userId = null) => {
  const result = await apiClient.get("/users/classe", {
    params: { user_id: userId },
  });
  return result.data;
};
