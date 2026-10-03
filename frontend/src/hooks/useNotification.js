import {
  countUnRead,
  deleteOneNotification,
  deleteUserNotif,
  listUsersNotification,
  readAllNotification,
  readOnNotification,
} from "@/api/notificationService";
import { authMemory } from "@/api/authMemory";
import { useCallback, useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const useNotification = (initialPage = 1, initialPageSize = 20) => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveStatus, setLiveStatus] = useState("connecting");
  const pageRef = useRef(initialPage);
  const retryTimeoutRef = useRef(null);
  const [pagination, setPagination] = useState({ page: initialPage, pageSize: initialPageSize, total: 0, pages: 1 });

  const fetchNotifications = useCallback(async (page, pageSize, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [data, unreadCount] = await Promise.all([
        listUsersNotification({ page, pageSize }),
        countUnRead(),
      ]);
      pageRef.current = data.page;
      setNotifications(data.items);
      setUnread(unreadCount);
      setPagination({ page: data.page, pageSize: data.page_size, total: data.total, pages: data.pages });
    } catch (err) {
      setError(err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(initialPage, initialPageSize);
  }, [fetchNotifications, initialPage, initialPageSize]);

  useEffect(() => {
    const controller = new AbortController();
    let retryDelay = 1000;

    const consumeStream = async () => {
      const token = authMemory.get();
      if (!token) {
        setLiveStatus("offline");
        return;
      }

      try {
        setLiveStatus("connecting");
        const response = await fetch(`${API_URL}/alerte_notifications/stream`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "text/event-stream" },
          signal: controller.signal,
          credentials: "include",
        });
        if (!response.ok || !response.body) throw new Error("Connexion temps réel indisponible");

        setLiveStatus("live");
        retryDelay = 1000;
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!controller.signal.aborted) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // EventSourceResponse uses CRLF delimiters.  Accept both CRLF and LF:
          // splitting only on "\n\n" silently drops every event sent with CRLF.
          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() || "";

          events.forEach((event) => {
            const type = event
              .split(/\r?\n/)
              .find((line) => line.startsWith("event:"))
              ?.slice(6)
              .trim();
            const data = event
              .split(/\r?\n/)
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trimStart())
              .join("\n");
            if (type !== "notification" || !data) return;
            try {
              const notification = JSON.parse(data);
              setUnread((count) => count + (notification.is_read ? 0 : 1));
              setPagination((current) => {
                const total = current.total + 1;
                return {
                  ...current,
                  total,
                  pages: Math.max(1, Math.ceil(total / current.pageSize)),
                };
              });
              if (pageRef.current === 1) {
                setNotifications((current) => current.some((item) => item.id === notification.id)
                  ? current
                  : [notification, ...current].slice(0, initialPageSize));
              }
            } catch {
              // Un événement invalide ne doit pas interrompre le flux.
            }
          });
        }
      } catch {
        if (!controller.signal.aborted) setLiveStatus("reconnecting");
      }

      if (!controller.signal.aborted) {
        retryTimeoutRef.current = window.setTimeout(consumeStream, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 15000);
      }
    };

    consumeStream();
    return () => {
      controller.abort();
      window.clearTimeout(retryTimeoutRef.current);
    };
  }, [initialPageSize]);

  const goToPage = (newPage) => fetchNotifications(newPage, pagination.pageSize);
  const execute = async (callback) => {
    setError(null);
    try { await callback(); } catch (err) { setError(err); throw err; }
  };

  const readAll = () => execute(async () => {
    await readAllNotification();
    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
    setUnread(0);
  });
  const read = (id) => execute(async () => {
    const target = notifications.find((item) => item.id === id);
    await readOnNotification(id);
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, is_read: true } : item));
    if (target && !target.is_read) setUnread((count) => Math.max(0, count - 1));
  });
  const deleteAll = () => execute(async () => {
    await deleteUserNotif();
    setNotifications([]); setUnread(0);
    setPagination((current) => ({ ...current, total: 0, pages: 1 }));
  });
  const deleteNotification = (id) => execute(async () => {
    const target = notifications.find((item) => item.id === id);
    await deleteOneNotification(id);
    setNotifications((current) => current.filter((item) => item.id !== id));
    if (target && !target.is_read) setUnread((count) => Math.max(0, count - 1));
    setPagination((current) => ({ ...current, total: Math.max(0, current.total - 1) }));
  });

  return { loading, error, pagination, notifications, unread, liveStatus, goToPage, read, readAll, deleteAll, deleteNotification };
};
