import { useNotification } from "@/hooks/useNotification";
import React from "react";

export default function NotificationManage() {
  const {
    loading,
    error,
    pagination,
    notifications,
    goToPage,
    unread,
    read,
    readAll,
    deleteAll,
    deleteNotification,
  } = useNotification();
  console.log(notifications);
  return <div>NotificationManage</div>;
}
