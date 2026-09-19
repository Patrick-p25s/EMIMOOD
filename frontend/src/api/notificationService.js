import apiClient from "./apiClient";

export const listUsersNotification = async ({
  page = 1,
  pageSize = 20,
} = {}) => {
  const res = await apiClient.get("/notification", {
    params: { page, page_size: pageSize },
  });
  return res.data;
};

export const deleteUserNotif = async () => {
  const res = await apiClient.delete("/notification");
  return res.data;
};

export const deleteOneNotification = async (notifId) => {
  const res = await apiClient.delete(`/notification/${notifId}`);
  return res.data;
};

export const readAllNotification = async () => {
  const res = await apiClient.patch("/notification");
  return res.data;
};

export const readOnNotification = async (notifId) => {
  const res = await apiClient.patch(`/notification/${notifId}`);
  return res.data;
};

export const countUnRead = async () => {
  const res = await apiClient.patch("/notification/unread-count");
  return res.data;
};
