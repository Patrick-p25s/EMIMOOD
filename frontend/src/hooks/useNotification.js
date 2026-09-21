import {
  countUnRead,
  deleteOneNotification,
  deleteUserNotif,
  listUsersNotification,
  readAllNotification,
  readOnNotification,
} from "@/api/notificationService";
import { useCallback, useEffect, useState } from "react";

export const useNotification = (initialPage = 1, initialPageSize = 20) => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 0,
  });
  const fetchNotification = useCallback(
    async (page, pageSize) => {
      setError(null);
      setLoading(true);
      try {
        const data = await listUsersNotification({ page, pageSize });
        setNotifications(data.items);
        setPagination({
          page: data.page,
          pageSize: data.page_size,
          total: data.total,
          pages: data.pages,
        });
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize],
  );

  const fetchUnread = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await countUnRead();
      setUnread(data);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  useEffect(() => {
    fetchNotification(initialPage, initialPageSize);
    fetchUnread();
  }, []);

  const goToPage = (newPage) => {
    fetchNotification(newPage, pagination.pageSize);
  };

  const execute = async (callback) => {
    setError(null);
    setLoading(true);
    try {
      await callback();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const readAll = () =>
    execute(async () => {
      await readAllNotification();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true })),
      );
    });

  const read = (id) =>
    execute(async () => {
      await readOnNotification(id);
      setNotifications((prev) =>
        prev.map((not) => (not.id === id ? { ...not, is_read: true } : not)),
      );
    });
  const deleteAll = () =>
    execute(async () => {
      await deleteUserNotif();
      setNotifications([]);
    });

  const deleteNotification = (id) =>
    execute(async () => {
      await deleteOneNotification(id);
      setNotifications((prev) => prev.filter((not) => not.id !== id));
    });

  return {
    loading,
    error,
    pagination,
    notifications,
    unread,
    goToPage,
    read,
    readAll,
    deleteAll,
    deleteNotification,
  };
};
