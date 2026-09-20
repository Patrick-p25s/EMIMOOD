import apiClient from "./apiClient";

export const listUsersNotification = async ({
  page = 1,
  pageSize = 20,
} = {}) => {
  const res = await apiClient.get("/notifications", {
    params: { page, page_size: pageSize },
  });
  return res.data;
};

export const deleteUserNotif = async () => {
  const res = await apiClient.delete("/notifications");
  return res.data;
};

export const deleteOneNotification = async (notifId) => {
  const res = await apiClient.delete(`/notifications/${notifId}`);
  return res.data;
};

export const readAllNotification = async () => {
  const res = await apiClient.patch("/notifications");
  return res.data;
};

export const readOnNotification = async (notifId) => {
  const res = await apiClient.patch(`/notifications/${notifId}`);
  return res.data;
};

export const countUnRead = async () => {
  const res = await apiClient.get("/notifications/unread-count");
  return res.data;
};
